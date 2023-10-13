import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { HelpCircle } from 'lucide-react';

const HelpDialog = () => {
  return (
    <Dialog>
      <DialogTrigger className='opacity-70 hover:opacity-100 transition-all duration-500'>
        <HelpCircle size={32} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to play?</DialogTitle>
          <DialogDescription>
            Guess today&rsquo;s anime character, anime or character anime by
            searching on the search bar.
          </DialogDescription>
        </DialogHeader>
        <DialogTitle>Properties</DialogTitle>
        <DialogDescription>
          For each gamemode there will be different properties, for example:
          name, season, studios, year, etc. You can see the properties of each
          gamemode after your first guess, those properties will guide you to
          guess the correct answer. If the property is{' '}
          <span className='text-green-600 font-medium'>GREEN</span> it means
          that the property is correct, if the property is{' '}
          <span className='text-rose-600 font-medium'>RED</span> it means that
          the property is incorrect and if the property is{' '}
          <span className='text-amber-600 font-medium'>ORANGE</span> it means
          that the property is partially correct.
        </DialogDescription>
        <DialogTitle>Image</DialogTitle>
        <DialogDescription>
          For each gamemode there will be a blurry image to guide you, the more
          you guess the more the image will be clear.
        </DialogDescription>
        <DialogFooter>GL HF</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
