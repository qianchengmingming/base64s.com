"use client";
import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
// 移除不使用的UI组件导入以减小bundle大小
import { Input } from '../ui/input';
import { Label } from '../ui/label';
// 简化UI，移除Tooltip以减小bundle大小
import { cacheGet, cacheSet } from '@/lib/cache';
import { getTimestamp } from '@/lib/time';
import { getNonceStr } from '@/lib/hash';
import { Switch } from '../ui/switch';
// 使用原生 Clipboard API 替代 copy-to-clipboard 库
import { useTranslations } from 'next-intl';
import { useLocale, useMessages } from 'next-intl';
import { lazy, Suspense } from 'react';

// 动态导入FAQ组件，减少首屏加载时间
const FAQ = lazy(() => import('@/components/blocks/faq'));

const AUTO_KEY = 'BASE64_AUTO';
const CUSTOM_KEY = 'BASE64_CUSTOM';
const CACHE_EXPIRE = 60 * 60 * 24 * 365; // 1 year in seconds
const AUTO_COPY_KEY = 'BASE64_AUTO_COPY';
const INPUT_KEY = 'BASE64_INPUT';
const OUTPUT_KEY = 'BASE64_OUTPUT';

// Base64 编码/解码组件
// 详细中文注释，便于理解每一步逻辑
const Base64Code: React.FC = () => {
  const t = useTranslations('home');
  // 输入内容
  const [input, setInput] = useState('');
  // 输出内容
  const [output, setOutput] = useState('');
  // 当前 tab，encode 或 decode
  const [tab, setTab] = useState<'encode' | 'decode'>('encode');
  // 自动编码/解码
  const [auto, setAuto] = useState(true);
  // 自定义字符串
  const [customStr, setCustomStr] = useState('');
  const [autoCopy, setAutoCopy] = useState(true);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // 判断是否为小屏（小于500px）
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 500);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 初始化本地缓存
  React.useEffect(() => {
    const autoCache = cacheGet(AUTO_KEY);
    setAuto(autoCache === null ? true : autoCache === 'true');
    const customCache = cacheGet(CUSTOM_KEY);
    setCustomStr(customCache || '');
    const autoCopyCache = cacheGet(AUTO_COPY_KEY);
    setAutoCopy(autoCopyCache === null ? true : autoCopyCache === 'true');
    // 恢复输入输出内容
    const inputCache = cacheGet(INPUT_KEY);
    if (inputCache !== null) setInput(inputCache);
    const outputCache = cacheGet(OUTPUT_KEY);
    if (outputCache !== null) setOutput(outputCache);
    // 页面加载后自动聚焦输入框
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  // 输入内容和输出内容持久化
  React.useEffect(() => {
    cacheSet(INPUT_KEY, input, getTimestamp() + CACHE_EXPIRE);
  }, [input]);
  React.useEffect(() => {
    cacheSet(OUTPUT_KEY, output, getTimestamp() + CACHE_EXPIRE);
  }, [output]);

  // 缓存 auto
  const handleAutoChange = (checked: boolean) => {
    setAuto(checked);
    cacheSet(AUTO_KEY, String(checked), getTimestamp() + CACHE_EXPIRE);
  };

  // 缓存 customStr
  const handleCustomStrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomStr(e.target.value);
    cacheSet(CUSTOM_KEY, e.target.value, getTimestamp() + CACHE_EXPIRE);
  };

  // 缓存 autoCopy
  const handleAutoCopyChange = (checked: boolean) => {
    setAutoCopy(checked);
    cacheSet(AUTO_COPY_KEY, String(checked), getTimestamp() + CACHE_EXPIRE);
  };

  // 处理输入变化，支持中文输入法
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (auto && !isComposing) {
      autoProcess(e.target.value);
    }
  };
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
    setIsComposing(false);
    if (auto) {
      autoProcess(e.currentTarget.value);
    }
  };

  // 输出内容可编辑
  const handleOutputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutput(e.target.value);
  };

  // 切换编码/解码 tab
  const handleTabChange = (value: string) => {
    setTab(value as 'encode' | 'decode');
    setOutput('');
    setInput('');
  };

  // 自动处理逻辑
  const autoProcess = (val: string) => {
    try {
      let decoded = decodeURIComponent(escape(atob(val)));
      if (customStr && decoded.includes(customStr)) {
        decoded = decoded.replaceAll(customStr, '');
      }
      setOutput(decoded);
      if (autoCopy) {
        navigator.clipboard?.writeText(decoded).catch(() => {
          // 降级到旧方法
          const textArea = document.createElement('textarea');
          textArea.value = decoded;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        });
      }
    } catch {
      try {
        let toEncode = val;
        if (customStr) {
          const insertAt = Math.floor(Math.random() * (toEncode.length + 1));
          toEncode = toEncode.slice(0, insertAt) + customStr + toEncode.slice(insertAt);
        }
        const encoded = btoa(unescape(encodeURIComponent(toEncode)));
        setOutput(encoded);
        if (autoCopy) {
          navigator.clipboard?.writeText(encoded).catch(() => {
            // 降级到旧方法
            const textArea = document.createElement('textarea');
            textArea.value = encoded;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          });
        }
      } catch {
        setOutput(t('auto_failed'));
      }
    }
  };

  // 编码操作
  const handleEncode = () => {
    try {
      let toEncode = input;
      if (customStr) {
        const insertAt = Math.floor(Math.random() * (toEncode.length + 1));
        toEncode = toEncode.slice(0, insertAt) + customStr + toEncode.slice(insertAt);
      }
      const encoded = btoa(unescape(encodeURIComponent(toEncode)));
      setOutput(encoded);
      if (autoCopy) {
        navigator.clipboard?.writeText(encoded).catch(() => {
          // 降级到旧方法
          const textArea = document.createElement('textarea');
          textArea.value = encoded;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        });
      }
    } catch (e) {
      setOutput(t('encode_failed'));
    }
  };

  // 解码操作
  const handleDecode = () => {
    try {
      let decoded = decodeURIComponent(escape(atob(input)));
      if (customStr && decoded.includes(customStr)) {
        decoded = decoded.replaceAll(customStr, '');
      }
      setOutput(decoded);
      if (autoCopy) {
        navigator.clipboard?.writeText(decoded).catch(() => {
          // 降级到旧方法
          const textArea = document.createElement('textarea');
          textArea.value = decoded;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        });
      }
    } catch (e) {
      setOutput(t('decode_failed'));
    }
  };

  // 交换输入输出内容
  const handleSwap = () => {
    setInput(output);
    setOutput(input);
  };

  // 从i18n多语言文件读取FAQ内容
  const messages = useMessages();
  const base64Faq = messages.home.base64_faq;

  return (
    <Card className="mt-8 mb-8 p-6 shadow-lg w-full bg-white">
      {/* 标题部分 */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-0">
        <span className="bg-green-600 text-white rounded px-2 py-1 text-xs font-bold sm:mr-2 mx-auto sm:mx-0">{t('brand')}</span>
        <h1 className="text-2xl font-bold text-center sm:text-left">{t('title')}</h1>
        <span className="text-gray-500 text-sm text-center sm:text-left sm:ml-2">{t('subtitle')}</span>
      </div>
      {/* 输入框 */}
      <Textarea
        ref={inputRef}
        className="w-full h-40 mb-2"
        placeholder={t('input_placeholder', { action: tab === 'encode' ? t('encode') : t('decode') })}
        value={input}
        onChange={handleInputChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
      {/* 移动端下，编码/解码按钮放在输入框和输出框之间，并有间距 */}
      {isMobile && (
        <div className="flex w-full mb-2">
          <Button onClick={handleEncode} variant={tab === 'encode' ? 'default' : 'outline'} style={{ width: '50%', minWidth: 120, marginRight: 8 }}>{t('encode')}</Button>
          <Button onClick={handleDecode} variant={tab === 'decode' ? 'default' : 'outline'} style={{ width: '50%', minWidth: 120 }}>{t('decode')}</Button>
        </div>
      )}
      {/* 操作按钮和选项（大屏） */}
      {!isMobile ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 flex-wrap w-full">
          {/* 左侧：按钮组和自定义字符串 */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto sm:flex-1" style={{ width: '100%' }}>
            <div className="flex w-1/2 flex-wrap gap-2 sm:w-auto">
              <Button onClick={handleEncode} variant={tab === 'encode' ? 'default' : 'outline'} style={{ width: 150 }}>{t('encode')}</Button>
              <Button onClick={handleDecode} variant={tab === 'decode' ? 'default' : 'outline'} style={{ width: 150 }}>{t('decode')}</Button>
              <Button variant="outline" onClick={handleSwap}>{t('swap')}</Button>
            </div>
            <div className="flex items-center ml-2">
              <Input
                className="w-48"
                placeholder={t('custom_str_placeholder')}
                value={customStr}
                onChange={handleCustomStrChange}
                title={t('custom_str_tip')}
              />
              <span className="text-xs text-gray-400 ml-2">{t('custom_str_hint')}</span>
            </div>
          </div>
          {/* 右侧：开关组 */}
          <div className="flex items-center gap-2 flex-wrap justify-center w-full sm:w-auto">
            <div className="flex items-center ml-2" title={t('auto_tip')}>
              <Switch id="auto-switch" checked={auto} onCheckedChange={handleAutoChange} />
              <Label htmlFor="auto-switch" className="ml-1 cursor-pointer">{t('auto_label')}</Label>
            </div>
            <div className="flex items-center ml-2" title={t('auto_copy_tip')}>
              <Switch id="auto-copy-switch" checked={autoCopy} onCheckedChange={handleAutoCopyChange} />
              <Label htmlFor="auto-copy-switch" className="ml-1 cursor-pointer">{t('auto_copy_label')}</Label>
            </div>
          </div>
        </div>
      ) : null}
      {/* 输出框 */}
      <div className="mb-2">
        <Textarea
          className="w-full h-40"
          value={output}
          onChange={handleOutputChange}
          placeholder={t('output_placeholder')}
        />
      </div>
      {/* 移动端下操作栏全部移到输出框下方，每项一行（除编码/解码按钮） */}
      {isMobile && (
        <div className="flex flex-col gap-2 mt-2 w-full">
          <Button variant="outline" onClick={handleSwap} className="w-full">{t('swap')}</Button>
          <div className="flex items-center w-full">
            <Input
              className="w-full"
              placeholder={t('custom_str_placeholder')}
              value={customStr}
              onChange={handleCustomStrChange}
              title={t('custom_str_tip')}
            />
          </div>
          <span className="text-xs text-gray-400 text-center">{t('custom_str_hint')}</span>
          <div className="text-xs text-gray-400 w-full text-center">{t('shortcut')}</div>
          <div className="flex items-center w-full justify-center" title={t('auto_tip')}>
            <Switch id="auto-switch" checked={auto} onCheckedChange={handleAutoChange} />
            <Label htmlFor="auto-switch" className="ml-1 cursor-pointer">{t('auto_label')}</Label>
          </div>
          <div className="flex items-center w-full justify-center" title={t('auto_copy_tip')}>
            <Switch id="auto-copy-switch" checked={autoCopy} onCheckedChange={handleAutoCopyChange} />
            <Label htmlFor="auto-copy-switch" className="ml-1 cursor-pointer">{t('auto_copy_label')}</Label>
          </div>
        </div>
      )}
      {/* 常见问题FAQ - 动态加载 */}
      {base64Faq && (
        <div className="mt-8">
          <Suspense fallback={<div className="text-center py-4 text-muted-foreground">Loading FAQ...</div>}>
            <FAQ section={base64Faq} />
          </Suspense>
        </div>
      )}
    </Card>
  );
};

export default Base64Code; 