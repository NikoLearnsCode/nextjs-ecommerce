import { UploadCloud } from "lucide-react";

export function UploadIcon({message}: {message?: string}) {
  return (
    <div className='flex flex-col items-center justify-center w-full p-2.5 border-2 border-dashed text-gray-600 transition-colors duration-200 hover:text-gray-800 hover:border-gray-400 group-data-[error]:text-red-500 group-data-[error]:border-red-500 group-data-[error]:hover:text-red-500 group-data-[error]:hover:border-red-500'>
      <UploadCloud size={32} strokeWidth={1.25} aria-hidden='true' />
      {message && <p className='text-[11px] mt-1 uppercase font-medium text-gray-600 group-data-[error]:text-red-500'>{message}</p>}
    </div>
  );
}
