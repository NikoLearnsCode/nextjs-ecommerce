
import React, {useRef, type ChangeEvent, type ReactNode} from 'react';

interface FileInputProps {
  id: string;
  label?: string;
  multiple?: boolean;
  name?: string;
  accept?: string;
  onFilesSelected: (files: File[]) => void;
  children: ReactNode;
  className?: string;
  }

const FileInput: React.FC<FileInputProps> = ({
  id,
  label = '',
  multiple = false,
  name,
  accept,
  onFilesSelected,
  children,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className='block uppercase ml-2 text-base text-black font-medium mb-4'
      >
        {label}
      </label>

      <div onClick={handleClick} className='cursor-pointer'>
        {children}
      </div>

      <input
        id={id}
        ref={inputRef}
        name={name}
        type='file'
        multiple={multiple}
        accept={accept}
        onChange={handleFileChange}
        className='hidden'
      />
    </div>
  );
};

export default FileInput;
