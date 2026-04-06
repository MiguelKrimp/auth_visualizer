import { CloseButton, Dialog } from '@chakra-ui/react';

type DialogComponentProps = {
  triggerComponent: React.ReactNode;
  content: React.ReactNode;
  onClose?: () => void;
};

export function DialogComponent({ triggerComponent, content, onClose }: DialogComponentProps) {
  return (
    <Dialog.Root lazyMount onExitComplete={onClose} size="sm">
      <Dialog.Trigger asChild>{triggerComponent}</Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="surface" borderColor="line" borderWidth="1px" borderRadius="md">
          <Dialog.Body p={4}>{content}</Dialog.Body>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
