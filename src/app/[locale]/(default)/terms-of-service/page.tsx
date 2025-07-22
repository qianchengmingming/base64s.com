'use client';
import { useTranslations } from 'next-intl';

export default function TermsOfServicePage() {
  const t = useTranslations('terms-of-service');
  return (
    <div className="container py-10 prose prose-slate dark:prose-invert">
      <h1>{t('title')}</h1>
      <p>{t('introduction')}</p>
      <h2>{t('use_of_service.title')}</h2>
      <p>{t('use_of_service.desc')}</p>
      <h2>{t('user_account.title')}</h2>
      <ul>
        <li>{t('user_account.create')}</li>
        <li>{t('user_account.security')}</li>
        <li>{t('user_account.notify')}</li>
      </ul>
      <h2>{t('intellectual_property.title')}</h2>
      <p>{t('intellectual_property.desc')}</p>
      <h2>{t('prohibited.title')}</h2>
      <p>{t('prohibited.desc')}</p>
      <h2>{t('privacy.title')}</h2>
      <p>{t('privacy.desc')}</p>
      <h2>{t('payment.title')}</h2>
      <p>{t('payment.desc')}</p>
      <h2>{t('termination.title')}</h2>
      <p>{t('termination.desc')}</p>
      <h2>{t('disclaimer.title')}</h2>
      <p>{t('disclaimer.desc')}</p>
      <h2>{t('liability.title')}</h2>
      <p>{t('liability.desc')}</p>
      <h2>{t('changes.title')}</h2>
      <p>{t('changes.desc')}</p>
      <h2>{t('contact.title')}</h2>
      <p>{t('contact.desc')}</p>
    </div>
  );
} 