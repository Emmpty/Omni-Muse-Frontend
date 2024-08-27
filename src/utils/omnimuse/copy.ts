import { showNotification } from '@mantine/notifications';

const copy = (text?: string) => {
  if (!text) {
    return;
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.style.position = 'fixed';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.style.top = '0.1rem';
    textarea.value = text;
    textarea.select();
    document.execCommand('copy', true);
    document.body.removeChild(textarea);
  }
  showNotification({
    message: 'copied successfully!',
    color: 'green',
    autoClose: 3000,
  });
};

export default copy;
