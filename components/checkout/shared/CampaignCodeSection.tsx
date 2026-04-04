'use client';

import {useState} from 'react';
import {Button} from '@/components/shared/ui/button';
import {Accordion} from '@/components/shared/ui/Accordion';
import {FloatingLabelInput} from '@/components/shared/ui/floatingLabelInput';

export default function CampaignCodeSection() {
  const [campaignCode, setCampaignCode] = useState('');

  const handleApplyCode = () => {
    if (!campaignCode.trim()) return;
  };

  return (
    <Accordion.Root
      type='single'
      collapsible={true}
      className='text-sm my-3 md:my-0 overflow-hidden '
    >
      <Accordion.Item
        value='campaignCode'
        className='border overflow-hidden  transition-colors duration-200 data-[state=open]:border-gray-500 '
      >
        <Accordion.Trigger className='outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset pl-4  pr-2.5 focus-visible:ring-black'>
          <h3 className='text-sm font-medium  border-none'>ADD PROMO CODE</h3>
        </Accordion.Trigger>
        <Accordion.Content className='p-3 '>
          <FloatingLabelInput
            type='text'
            id='campaignCode'
            label='Promo code'
            value={campaignCode}
            onChange={(e) => setCampaignCode(e.target.value)}
          />
          <Button
            type='button'
            variant='outline'
            className='w-full mt-2  border-gray-400/80 active:border-gray-600 hover:border-gray-600 shadow-none hover:bg-white text-xs uppercase font-bold'
            onClick={handleApplyCode}
          >
            Apply code
          </Button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
