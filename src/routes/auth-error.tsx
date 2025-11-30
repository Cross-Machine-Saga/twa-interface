import { createFileRoute, Link } from '@tanstack/react-router';
import { PageLayout } from '@/components/ui/page-layout';
import { CopyButton } from '@/components/ui/copy-button';
import { Page, TELEGRAM_APP_URL } from '@/lib/constants';

import qrCode from "@/assets/images/qr-code.png";

export const Route = createFileRoute(Page.ErrorAuth)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout className='flex flex-col items-center gap-3 mt-[140px]'>
      <img
        className='size-[280px] border-6 border-[#1f1f1f] rounded-3xl'
        src={qrCode}
        alt="QR Code"
      />

      <div className='inline-flex items-center gap-2 bg-[#1f1f1f] py-1 px-1.5 rounded-2xl'>
        <p className='bg-white text-black font-semibold truncate max-w-[280px] px-2 py-1 rounded-xl'>
          {TELEGRAM_APP_URL}
        </p>
        <CopyButton
          className='size-8 text-white hover:bg-[#1f1f1f] hover:text-white'
          content={TELEGRAM_APP_URL}
        />
      </div>

      <Link
        to={TELEGRAM_APP_URL}
        target='_blank'
        className='bg-[#1f1f1f] py-2 px-1.5 rounded-2xl text-white font-semibold w-[332px] text-center'
      >
        Или можно перейти по ссылке
      </Link>
    </PageLayout>
  );
}