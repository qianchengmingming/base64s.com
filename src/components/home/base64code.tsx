"use client";
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

// Base64 编码/解码组件
// 详细中文注释，便于理解每一步逻辑
const Base64Code: React.FC = () => {
  // 输入内容
  const [input, setInput] = useState('');
  // 输出内容
  const [output, setOutput] = useState('');
  // 当前 tab，encode 或 decode
  const [tab, setTab] = useState<'encode' | 'decode'>('encode');

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // 切换编码/解码 tab
  const handleTabChange = (value: string) => {
    setTab(value as 'encode' | 'decode');
    setOutput('');
    setInput('');
  };

  // 编码操作
  const handleEncode = () => {
    try {
      // 使用 btoa 进行 Base64 编码
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch (e) {
      setOutput('编码失败：输入内容可能包含无法编码的字符');
    }
  };

  // 解码操作
  const handleDecode = () => {
    try {
      // 使用 atob 进行 Base64 解码
      setOutput(decodeURIComponent(escape(atob(input))));
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
      <Card className=" mt-8 p-6 shadow-lg w-full">
      {/* 标题部分 */}
      <div className="flex items-center mb-4">
        <span className="bg-green-600 text-white rounded px-2 py-1 text-xs font-bold mr-2">Base64.us</span>
        <h1 className="text-2xl font-bold">Base64 在线编码解码</h1>
        <span className="ml-2 text-gray-500 text-sm">(最好用的 Base64 在线工具)</span>
      </div>
      {/* Tab 切换 */}
      <Tabs value={tab} onValueChange={handleTabChange} className="mb-4">
        <TabsList>
          <TabsTrigger value="encode">编码 (Encode)</TabsTrigger>
          <TabsTrigger value="decode">解码 (Decode)</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* 输入框 */}
      <Textarea
        className="w-full h-32 mb-2"
        placeholder={`请输入要进行 Base64 ${tab === 'encode' ? '编码' : '解码'} 的字符串`}
        value={input}
        onChange={handleInputChange}
      />
      {/* 操作按钮 */}
      <div className="flex items-center gap-2 mb-2">
        <Button onClick={tab === 'encode' ? handleEncode : handleDecode}>
          {tab === 'encode' ? '编码 (Encode)' : '解码 (Decode)'}
        </Button>
        <Button variant="outline" onClick={handleSwap}>↑ 交换</Button>
        <span className="text-xs text-gray-400 ml-2">(编码/解码快捷键：Ctrl + Enter)</span>
      </div>
      {/* 输出框 */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Base64 编码或解码的结果：</label>
        <Textarea
          className="w-full h-24"
          value={output}
          readOnly
          placeholder="结果将在这里显示"
        />
      </div>
      {/* 说明文字 */}
      <div className="bg-blue-50 text-blue-700 p-2 rounded text-xs mb-2">
        请在上方第一个文本框中输入要编码/解码的字符串。
      </div>
      {/* 文件上传（未实现，仅界面展示） */}
      <div className="bg-gray-50 p-2 rounded text-xs flex items-center">
        <span>也可以选择图片/文件来获取它的 Base64 编码的 DataURI 形式：</span>
        <input type="file" className="ml-2" disabled />
        <span className="ml-2 text-gray-400">未选择任何文件</span>
      </div>
    </Card>
  );
};

export default Base64Code; 