#!/usr/bin/env bun

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { generateCoverLetter } from '../src/lib/cover-letter-generator';
import { extractCompanyName, fetchJDAsMarkdown } from '../src/lib/jd-fetcher';
import { createLLMClient } from '../src/lib/llm-client';
import type { RoleType } from '../src/lib/role-filter';
import type { JSONResume } from '../src/types/json-resume';

const program = new Command();

program
  .name('generate-cover-letter')
  .description('Generate a tailored cover letter from a job description URL')
  .version('1.0.0')
  .option('-u, --url <url>', 'Job description URL')
  .option('-c, --company <company>', 'Company name')
  .option('-r, --role <role>', 'Target role (architect, manager, founder, etc.)')
  .option('-p, --provider <provider>', 'LLM provider (claude or ollama)', 'claude')
  .option('-m, --model <model>', 'Ollama model name (only for ollama provider)', 'llama3.1')
  .option('-o, --output <path>', 'Output file path (default: auto-generated)')
  .action(async (options) => {
    try {
      // Interactive prompts for missing required fields
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'url',
          message: 'Job description URL:',
          when: !options.url,
          validate: (input) => {
            try {
              new URL(input);
              return true;
            } catch {
              return 'Please enter a valid URL';
            }
          },
        },
        {
          type: 'input',
          name: 'company',
          message: 'Company name:',
          when: !options.company,
        },
        {
          type: 'list',
          name: 'role',
          message: 'Target role:',
          choices: [
            { name: 'All roles', value: 'all' },
            { name: 'Architect', value: 'architect' },
            { name: 'Manager', value: 'manager' },
            { name: 'Founder', value: 'founder' },
            { name: 'Senior IC', value: 'ic-senior' },
            { name: 'Staff IC', value: 'ic-staff' },
            { name: 'Consultant', value: 'consultant' },
            { name: 'AI Engineer', value: 'ai-engineer' },
          ],
          when: !options.role,
        },
        {
          type: 'list',
          name: 'provider',
          message: 'LLM Provider:',
          choices: [
            { name: 'Claude (Anthropic)', value: 'claude' },
            { name: 'Ollama (Local)', value: 'ollama' },
          ],
          when: !options.provider,
        },
        {
          type: 'input',
          name: 'model',
          message: 'Ollama model name:',
          default: 'llama3.1',
          when: (answers) => (answers.provider || options.provider) === 'ollama' && !options.model,
        },
      ]);

      const url = options.url || answers.url;
      const company = options.company || answers.company;
      const role = (options.role || answers.role || 'all') as RoleType;
      const provider = (options.provider || answers.provider || 'claude') as 'claude' | 'ollama';
      const model = options.model || answers.model || 'llama3.1';

      console.log('\n📥 Fetching job description...');
      const jdMarkdown = await fetchJDAsMarkdown(url);

      // Try to extract company name if not provided
      let companyName = company;
      if (!companyName) {
        const extracted = extractCompanyName(url, jdMarkdown);
        if (extracted) {
          companyName = extracted;
          console.log(`📝 Extracted company name: ${companyName}`);
        } else {
          throw new Error('Company name is required. Please provide it with --company flag.');
        }
      }

      console.log('📄 Loading resume...');
      const resumePath = join(
        process.cwd(),
        'src',
        'artifacts',
        'alex_alexandrescu_master_resume.json'
      );
      const resumeData = await readFile(resumePath, 'utf-8');
      const resume: JSONResume = JSON.parse(resumeData);

      console.log(`🤖 Generating cover letter with ${provider}...`);
      const llmClient = createLLMClient(provider, { model });
      const coverLetter = await generateCoverLetter({
        resume,
        jdMarkdown,
        companyName,
        role,
        llmClient,
      });

      // Generate output filename
      const dateStr = new Date().toISOString().split('T')[0];
      const companySlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const outputDir = join(process.cwd(), 'src', 'artifacts', 'cover-letters');
      await mkdir(outputDir, { recursive: true });

      const outputPath = options.output || join(outputDir, `${companySlug}-${dateStr}.json`);

      console.log(`💾 Saving cover letter to ${outputPath}...`);
      await writeFile(outputPath, JSON.stringify(coverLetter, null, 2), 'utf-8');

      console.log('\n✅ Cover letter generated successfully!');
      console.log(`\n📄 File: ${outputPath}`);
      console.log(`\n📋 Preview:`);
      console.log(`   To: ${coverLetter.recipient.name} at ${coverLetter.recipient.company}`);
      console.log(`   Date: ${coverLetter.date}`);
      console.log(`   Salutation: ${coverLetter.salutation}`);
      console.log(`\n   ${coverLetter.paragraphs.introduction.substring(0, 100)}...`);
      console.log(`\n   ${coverLetter.paragraphs.qualifications.substring(0, 100)}...`);
    } catch (error) {
      console.error('\n❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();


