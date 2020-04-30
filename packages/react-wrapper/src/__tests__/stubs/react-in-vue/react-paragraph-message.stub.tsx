import React from 'react';

export interface MessageProps {
  message: string;
}

export function ParagraphMessage(props: MessageProps) {
  return (
    <p>
      { props.message ?? 'Hello world!' }
    </p>
  );
}
