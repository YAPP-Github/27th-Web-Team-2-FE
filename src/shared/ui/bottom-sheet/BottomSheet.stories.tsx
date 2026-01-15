import { useDisclosure } from '@/shared/hooks/useDisclosure';

import BottomSheet from './BottomSheet';

const meta: Meta<typeof BottomSheet> = {
  title: 'Shared/UI/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BottomSheet>;

const BottomSheetWithHooks = () => {
  const { isOpen, open, close } = useDisclosure();

  return (
    <div className='flex h-screen w-full items-center justify-center bg-gray-100 p-4'>
      <button
        className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
        onClick={open}
      >
        Open BottomSheet
      </button>
      <BottomSheet onClose={close} isOpen={isOpen}>
        <div className='px-5'>
          <h2 className='text-title-2 text-text-primary mb-2'>
            Bottom Sheet Title
          </h2>
          <p className='text-body-2 text-text-secondary'>
            Here is some content inside the bottom sheet. You can put anything
            here.
          </p>
          <div className='mt-4 flex flex-col gap-2'>
            <button className='bg-primary-default w-full rounded py-3 font-medium text-white'>
              Confirm
            </button>
            <button
              className='text-text-secondary w-full rounded bg-gray-100 py-3 font-medium'
              onClick={close}
            >
              Cancel
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export const Default: Story = {
  render: () => <BottomSheetWithHooks />,
};
