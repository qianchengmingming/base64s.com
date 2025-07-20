"use client";
import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { cacheGet, cacheSet } from '@/lib/cache';
import { getTimestamp } from '@/lib/time';
import { getNonceStr } from '@/lib/hash';
import { Switch } from '../ui/switch';
import copy from 'copy-to-clipboard';

const AUTO_KEY = 'BASE64_AUTO';
const CUSTOM_KEY = 'BASE64_CUSTOM';
const CACHE_EXPIRE = 60 * 60 * 24 * 365; // 1 year in seconds
const AUTO_COPY_KEY = 'BASE64_AUTO_COPY';
const INPUT_KEY = 'BASE64_INPUT';
const OUTPUT_KEY = 'BASE64_OUTPUT';

// Base64 编码/解码组件
// 详细中文注释，便于理解每一步逻辑
const Base64Code: React.FC = () => {
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
      if (autoCopy) copy(decoded);
    } catch {
      try {
        let toEncode = val;
        if (customStr) {
          const insertAt = Math.floor(Math.random() * (toEncode.length + 1));
          toEncode = toEncode.slice(0, insertAt) + customStr + toEncode.slice(insertAt);
        }
        const encoded = btoa(unescape(encodeURIComponent(toEncode)));
        setOutput(encoded);
        if (autoCopy) copy(encoded);
      } catch {
        setOutput('自动处理失败：输入内容无法编码或解码');
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
      if (autoCopy) copy(encoded);
    } catch (e) {
      setOutput('编码失败：输入内容可能包含无法编码的字符');
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
      if (autoCopy) copy(decoded);
    } catch (e) {
      setOutput('解码失败：输入内容不是有效的 Base64 字符串');
    }
  };

  // 交换输入输出内容
  const handleSwap = () => {
    setInput(output);
    setOutput(input);
  };

  return (
    <Card className="mt-8 mb-8 p-6 shadow-lg w-full bg-white">
      {/* 标题部分 */}
      <div className="flex items-center mb-4">
        <span className="bg-green-600 text-white rounded px-2 py-1 text-xs font-bold mr-2">Base64s.com</span>
        <h1 className="text-2xl font-bold">Base64在线编码解码</h1>
        <span className="ml-2 text-gray-500 text-sm">(最好用的 Base64 在线工具)</span>
      </div>
      {/* 输入框 */}
      <Textarea
        ref={inputRef}
        className="w-full h-40 mb-2"
        placeholder={`请输入要进行 Base64 ${tab === 'encode' ? '编码' : '解码'} 的字符串`}
        value={input}
        onChange={handleInputChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
      {/* 操作按钮和选项 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 flex-wrap w-full">
        {/* 左侧：按钮组和自定义字符串 */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={handleEncode} variant={tab === 'encode' ? 'default' : 'outline'}>编码 (Encode)</Button>
          <Button onClick={handleDecode} variant={tab === 'decode' ? 'default' : 'outline'}>解码 (Decode)</Button>
          <Button variant="outline" onClick={handleSwap}>↑ 交换</Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center ml-2">
                <Input
                  className="w-48"
                  placeholder="自动添加/删除的字符串"
                  value={customStr}
                  onChange={handleCustomStrChange}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              在编码时会随机在某个位置插入此固定字符串，解码时会自动删除，可用于防止被直接识别。比如对密码进行加密，别人解码后无法直接使用，建议填写 base64s.com
            </TooltipContent>
            <span className="text-xs text-gray-400 ml-2">(比原始内容多字符，可用于防止被直接识别)</span>
          </Tooltip>
        </div>
        {/* 右侧：开关组 */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center ml-2">
                <Switch id="auto-switch" checked={auto} onCheckedChange={handleAutoChange} />
                <Label htmlFor="auto-switch" className="ml-1 cursor-pointer">自动编码/解码</Label>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              开启后将尝试自动解码，若无法解码则会自动编码。
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center ml-2">
                <Switch id="auto-copy-switch" checked={autoCopy} onCheckedChange={handleAutoCopyChange} />
                <Label htmlFor="auto-copy-switch" className="ml-1 cursor-pointer">自动复制结果</Label>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              开启后每次编码/解码/自动处理后会自动复制结果到剪贴板
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {/* 输出框 */}
      <div className="mb-2">
        <Textarea
          className="w-full h-40"
          value={output}
          onChange={handleOutputChange}
          placeholder="结果将在这里显示"
        />
      </div>
    </Card>
  );
};

export default Base64Code; 