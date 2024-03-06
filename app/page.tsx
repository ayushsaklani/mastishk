'use client';
import { ChatWindow } from './components/ChatWindow';

export default function Chat() {
  const InfoCard= (
    <div>
      Mastishk, Your Friendly AI Assistant!
    </div>
  );
  return (
    <ChatWindow
    endpoint='api/chat'
    emoji="🤖"
    titleText="Mastishk"
    placeholder="Hi, I am your friendly AI Assistant Mastishk."
    emptyStateComponent={InfoCard}
    ></ChatWindow>
  );
}
