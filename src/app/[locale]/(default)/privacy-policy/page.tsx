'use client';
import { useTranslations } from 'next-intl';

export default function PrivacyPolicyPage() {
  const t = useTranslations('privacy-policy');
  return (
    <div className="container py-10 prose prose-slate dark:prose-invert">
      <h1>{t('title')}</h1>
      <p>{t('introduction')}</p>
      <h2>{t('information_collection.title')}</h2>
      <ul>
        <li>{t('information_collection.account')}</li>
        <li>{t('information_collection.usage')}</li>
        <li>{t('information_collection.device')}</li>
        <li>{t('information_collection.cookies')}</li>
        <li>{t('information_collection.payment')}</li>
      </ul>
      <h2>{t('data_security.title')}</h2>
      <p>{t('data_security.desc')}</p>
      <h2>{t('sharing.title')}</h2>
      <p>{t('sharing.desc')}</p>
      <h2>{t('changes.title')}</h2>
      <p>{t('changes.desc')}</p>
      <h2>{t('contact.title')}</h2>
      <p>{t('contact.desc')}</p>
    </div>
  );
} 