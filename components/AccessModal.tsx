'use client';

import { useButton } from '@react-aria/button';
import { FocusScope } from '@react-aria/focus';
import { OverlayContainer } from '@react-aria/overlays';
import { useTextField } from '@react-aria/textfield';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, CheckCircle2, Mail, User } from 'lucide-react';
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
        setAccessData({ name, email, company: company || undefined, granted: true });
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

  return (
    <AnimatePresence>
      {isOpen && (
        <OverlayContainer>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              // Prevent closing on outside click as per requirements
              e.stopPropagation();
            }}
          >
            <FocusScope contain restoreFocus autoFocus>
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-[500px] p-8 md:p-12"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="access-modal-title"
                aria-describedby="access-modal-description"
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative inline-block mb-4"
                  >
                    <img
                      src={headshot}
                      alt={profileName}
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-primary/20"
                    />
                  </motion.div>
                  <h2
                    id="access-modal-title"
                    className="text-2xl md:text-3xl font-bold mb-2 text-card-foreground"
                  >
                    {profileName}
                  </h2>
                  <p className="text-muted-foreground text-lg">{profileTitle}</p>
                </div>

                {!isSubmitted ? (
                  <>
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                        {dictionary.accessModal.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {dictionary.accessModal.subtitle}
                      </p>
                      <ul className="space-y-3 mb-6">
                        {benefits.map((benefit) => {
                          const Icon = benefit.icon;
                          return (
                            <motion.li
                              key={benefit.text}
                              className="flex items-center gap-3 text-card-foreground"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                              <span>{benefit.text}</span>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                      className="space-y-5"
                    >
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-2 text-card-foreground flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          {dictionary.accessModal.fields.name.label}
                        </label>
                        <input
                          {...nameProps}
                          ref={nameInputRef}
                          id="name"
                          className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all"
                        />
                        {nameError && (
                          <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                            <span>⚠</span> {nameError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2 text-card-foreground flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          {dictionary.accessModal.fields.email.label}
                        </label>
                        <input
                          {...emailProps}
                          ref={emailInputRef}
                          id="email"
                          className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all"
                        />
                        {emailError && (
                          <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                            <span>⚠</span> {emailError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="company"
                          className="block text-sm font-medium mb-2 text-card-foreground flex items-center gap-2"
                        >
                          <Building2 className="w-4 h-4" />
                          {dictionary.accessModal.fields.company.label}
                        </label>
                        <input
                          {...companyProps}
                          ref={companyInputRef}
                          id="company"
                          className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all"
                        />
                      </div>

                      <button
                        {...submitButtonProps}
                        ref={submitButtonRef}
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting
                          ? dictionary.accessModal.submitting
                          : dictionary.accessModal.submit}
                      </button>
                    </form>

                    <div className="mt-6 space-y-2">
                      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                        <span>🔒</span> {dictionary.accessModal.footer.security}
                      </p>
                      <p className="text-xs text-muted-foreground text-center">
                        {dictionary.accessModal.footer.required}
                      </p>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-card-foreground mb-2">
                      Access Granted!
                    </h3>
                    <p className="text-muted-foreground">Welcome, {name}!</p>
                  </motion.div>
                )}
              </motion.div>
            </FocusScope>
          </motion.div>
        </OverlayContainer>
      )}
    </AnimatePresence>
  );
}
