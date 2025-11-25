'use client';

import { useButton } from '@react-aria/button';
import { FocusScope } from '@react-aria/focus';
import { OverlayContainer } from '@react-aria/overlays';
import { useTextField } from '@react-aria/textfield';
import { Building2, CheckCircle2, Mail, User } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import { setAccessData } from '@/lib/storage';

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  dictionary: Dictionary;
  profileName: string;
  profileTitle: string;
  headshot: string;
}

export function AccessModal({
  isOpen,
  onClose,
  dictionary,
  profileName,
  profileTitle,
  headshot,
}: AccessModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);

  const nameProps = useTextField(
    {
      label: dictionary.accessModal.fields.name.label,
      placeholder: dictionary.accessModal.fields.name.placeholder,
      value: name,
      onChange: setName,
      isRequired: true,
      autoFocus: true,
    },
    nameInputRef
  ).inputProps;

  const emailProps = useTextField(
    {
      label: dictionary.accessModal.fields.email.label,
      placeholder: dictionary.accessModal.fields.email.placeholder,
      value: email,
      onChange: setEmail,
      type: 'email',
      isRequired: true,
    },
    emailInputRef
  ).inputProps;

  const companyProps = useTextField(
    {
      label: dictionary.accessModal.fields.company.label,
      placeholder: dictionary.accessModal.fields.company.placeholder,
      value: company,
      onChange: setCompany,
    },
    companyInputRef
  ).inputProps;

  const submitButtonRef = useRef(null);
  const submitButtonProps = useButton(
    {
      onPress: handleSubmit,
      isDisabled: isSubmitting || isSubmitted,
    },
    submitButtonRef
  ).buttonProps;

  async function handleSubmit() {
    setNameError('');
    setEmailError('');

    let hasError = false;

    if (!name.trim() || name.trim().length < 2) {
      setNameError(dictionary.accessModal.fields.name.error);
      hasError = true;
    }

    if (!email.trim() || !email.includes('@')) {
      setEmailError(dictionary.accessModal.fields.email.error);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const lang = window.location.pathname.split('/')[1] || 'en';
      const response = await fetch(`/${lang}/api/access-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company: company || undefined }),
      });

      if (response.ok) {
        setAccessData({ name, email, company: company || undefined });
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting access request:', error);
      setEmailError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const benefits = [
    { icon: CheckCircle2, text: dictionary.accessModal.benefits.cv },
    { icon: CheckCircle2, text: dictionary.accessModal.benefits.projects },
    { icon: CheckCircle2, text: dictionary.accessModal.benefits.packages },
    { icon: CheckCircle2, text: dictionary.accessModal.benefits.downloads },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <OverlayContainer>
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="min-h-full w-full flex items-center justify-center py-8">
          <FocusScope contain restoreFocus autoFocus>
            <div
              className="relative w-full max-w-md mx-auto transition-all duration-300"
              role="dialog"
              aria-labelledby="access-modal-title"
              aria-describedby="access-modal-description"
            >
              {/* Gradient glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-20 blur-2xl" />

              <div className="relative glass-strong shadow-apple-xl rounded-3xl p-6 sm:p-8 md:p-10">
                <div className="text-center mb-6 sm:mb-8">
                  {headshot && (
                    <div className="relative inline-block mb-4 transition-transform duration-300">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-30" />
                      <Image
                        src={headshot}
                        alt={profileName}
                        width={100}
                        height={100}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto object-cover shadow-apple-lg ring-4 ring-white/30 dark:ring-white/10"
                      />
                    </div>
                  )}
                  <h2
                    id="access-modal-title"
                    className="text-2xl sm:text-3xl font-extrabold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                  >
                    {profileName}
                  </h2>
                  <p className="text-muted-foreground text-base sm:text-lg font-medium">
                    {profileTitle}
                  </p>
                </div>

                {!isSubmitted ? (
                  <>
                    <div className="mb-6 sm:mb-8">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {dictionary.accessModal.title}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6 font-light">
                        {dictionary.accessModal.subtitle}
                      </p>
                      <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                        {benefits.map((benefit, index) => {
                          const Icon = benefit.icon;
                          return (
                            <li
                              key={benefit.text}
                              className="flex items-start gap-3 text-foreground/90 text-sm sm:text-base transition duration-200"
                              style={{ transitionDelay: `${0.1 * index}s` }}
                            >
                              <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="leading-snug">{benefit.text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                      className="space-y-4 sm:space-y-5"
                    >
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-primary" />
                          {dictionary.accessModal.fields.name.label}
                        </label>
                        <input
                          {...nameProps}
                          ref={nameInputRef}
                          id="name"
                          className="w-full px-4 py-3 glass-subtle border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all placeholder:text-muted-foreground/50 text-sm sm:text-base shadow-apple"
                        />
                        {nameError && (
                          <p className="mt-2 text-sm text-destructive flex items-center gap-1.5 font-medium transition-opacity">
                            <span>⚠</span> {nameError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4 text-primary" />
                          {dictionary.accessModal.fields.email.label}
                        </label>
                        <input
                          {...emailProps}
                          ref={emailInputRef}
                          id="email"
                          className="w-full px-4 py-3 glass-subtle border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all placeholder:text-muted-foreground/50 text-sm sm:text-base shadow-apple"
                        />
                        {emailError && (
                          <p className="mt-2 text-sm text-destructive flex items-center gap-1.5 font-medium transition-opacity">
                            <span>⚠</span> {emailError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="company"
                          className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2"
                        >
                          <Building2 className="w-4 h-4 text-primary" />
                          {dictionary.accessModal.fields.company.label}
                        </label>
                        <input
                          {...companyProps}
                          ref={companyInputRef}
                          id="company"
                          className="w-full px-4 py-3 glass-subtle border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all placeholder:text-muted-foreground/50 text-sm sm:text-base shadow-apple"
                        />
                      </div>

                      <button
                        {...submitButtonProps}
                        ref={submitButtonRef}
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold py-3.5 sm:py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-apple-lg hover:shadow-apple-xl text-sm sm:text-base transform hover:scale-[1.02] active:scale-95"
                      >
                        {isSubmitting
                          ? dictionary.accessModal.submitting
                          : dictionary.accessModal.submit}
                      </button>
                    </form>

                    <div className="mt-5 sm:mt-6 space-y-2">
                      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5 font-medium">
                        <span>🔒</span> {dictionary.accessModal.footer.security}
                      </p>
                      <p className="text-xs text-muted-foreground text-center font-light">
                        {dictionary.accessModal.footer.required}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 sm:py-12 transition duration-300">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                      <div className="relative w-full h-full glass-strong rounded-full flex items-center justify-center shadow-apple-lg">
                        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold mb-2 sm:mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Access Granted!
                    </h3>
                    <p className="text-muted-foreground text-base sm:text-lg font-medium">
                      Welcome, {name}!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </FocusScope>
        </div>
      </div>
    </OverlayContainer>
  );
}
