import React, {type ChangeEvent, type ReactNode} from 'react';

interface FileInputProps {
  id: string;
  label?: string;
  multiple?: boolean;
  name?: string;
  accept?: string;
  onFilesSelected: (files: File[]) => void;
  children: ReactNode;
  className?: string;
  /**
   * Images are validated separately from react-hook-form, so the error state
   * is driven manually by the parent form (e.g. on submit with no files).
   */
  hasError?: boolean;
  /** Announced to screen readers when `hasError` is true. */
  errorMessage?: string;
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
  hasError = false,
  errorMessage,
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
    }
  };

  const labelId = `${id}-label`;
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      {label && (
        <span
          id={labelId}
          className='block uppercase ml-2 text-base text-black font-medium mb-4'
        >
          {label}
        </span>
      )}

      <div className='relative'>
        <input
          id={id}
          name={name}
          type='file'
          multiple={multiple}
          accept={accept}
          onChange={handleFileChange}
          aria-labelledby={label ? labelId : undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError && errorMessage ? errorId : undefined}
          className='peer sr-only'
        />

        <label
          htmlFor={id}
          data-error={hasError ? 'true' : undefined}
          className='group block w-full cursor-pointer rounded-md outline-none peer-focus-visible:ring-3 peer-focus-visible:ring-black mx-0.5'
        >
          {children}
        </label>
      </div>

      {/* Visual error styling lives in the children (UploadIcon) via
          `group-data-[error]`; this announces the same state to screen readers. */}
      {hasError && errorMessage && (
        <p id={errorId} role='alert' className='sr-only'>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FileInput;
