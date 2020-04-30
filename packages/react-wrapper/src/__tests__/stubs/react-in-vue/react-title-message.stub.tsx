import React from 'react';

export interface MessageProps {
  message: string;
}

export function TitleMessage(props: MessageProps) {
  return (
    <h1>
      { props.message ?? 'Hello world!' }
    </h1>
  );
}
