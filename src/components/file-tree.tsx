'use client';

import type { Directory, File } from '@/lib/repository';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  File as FileIcon,
  FileCode2,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  directory: Directory;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

const getFileIcon = (language: File['language']) => {
  switch (language) {
    case 'javascript':
      return <FileCode2 className="size-4" />;
    case 'python':
      return <FileCode2 className="size-4" />;
    case 'json':
      return <FileJson className="size-4" />;
    case 'markdown':
      return <FileText className="size-4" />;
    default:
      return <FileIcon className="size-4" />;
  }
};

const DirectoryView: React.FC<{
  dir: Directory;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  level: number;
}> = ({ dir, onFileSelect, selectedFile, level }) => {
  const [isOpen, setIsOpen] = useState(level < 2);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-2"
          style={{ paddingLeft: `${level * 1}rem` }}
        >
          {isOpen ? <FolderOpen className="size-4" /> : <Folder className="size-4" />}
          <span>{dir.name}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col">
          {dir.directories.map((subDir) => (
            <DirectoryView
              key={subDir.name}
              dir={subDir}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
              level={level + 1}
            />
          ))}
          {dir.files.map((file) => (
            <Button
              key={file.name}
              variant="ghost"
              className={cn(
                'w-full justify-start gap-2 px-2',
                selectedFile?.name === file.name &&
                  selectedFile.content === file.content &&
                  'bg-sidebar-accent text-sidebar-accent-foreground'
              )}
              onClick={() => onFileSelect(file)}
              style={{ paddingLeft: `${level * 1 + 0.5}rem` }}
            >
              {getFileIcon(file.language)}
              <span>{file.name}</span>
            </Button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({
  directory,
  onFileSelect,
  selectedFile,
}) => {
  return (
    <div className="p-2">
      <DirectoryView
        dir={directory}
        onFileSelect={onFileSelect}
        selectedFile={selectedFile}
        level={0}
      />
    </div>
  );
};
