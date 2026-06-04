'use client';

import {Button} from '@/components/shared/ui/button';
import {useAdmin} from '@/context/AdminProvider';
import {ArrowRight} from 'lucide-react';
import {ADMIN_FORM_DIALOG_ID} from '@/components/admin/adminForm.constants';

type AdminHeaderProps = {
  title: string;
  count?: number;
  button?: React.ReactNode;
  buttonShow?: boolean;
  formType?: 'category' | 'product';
};

export default function AdminHeader({
  title,
  count,
  buttonShow,
  formType,
}: AdminHeaderProps) {
  const {openSidebar} = useAdmin();

  const handleClick = () => {
    if (formType) {
      openSidebar(formType);
    }
  };

  return (
    <div className='pr-2 pb-4 min-h-17 flex items-center justify-between'>
      <h1 className='text-sm uppercase  font-semibold'>
        {title} {count && count > 0 ? `(${count})` : ''}
      </h1>

      {buttonShow && formType && (
        <Button
          variant='link'
          className='gap-0 m-0 py-0  h-7   text-gray-900 focus:no-underline uppercase font-bold  decoration-1   underline underline-offset-3 shadow-none text-xs group  '
          command='show-modal'
          commandfor={ADMIN_FORM_DIALOG_ID}
          onClick={handleClick}
        >
          {/* <span className='text-xl  font-medium mb-[5px]'>n</span>ew{' '} */}
          new{' '}
          {formType === 'product' ? 'product' : 'category'}
          <ArrowRight
            size={8}
            strokeWidth={1.5}
            className='group-hover:translate-x-1 ml-1.5 mb-[1px] transition-transform duration-300'
          />
        </Button>
      )}
    </div>
  );
}
