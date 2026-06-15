import { useChat } from "./hooks/useChat";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { MessageThread } from "./components/MessageThread";
import { ReplyOptions } from "./components/ReplyOptions";
import { InputForm } from "./components/InputForm";

export function MessagesWindow() {
  const {
    isEn,
    searchQuery,
    setSearchQuery,
    typedMessage,
    setTypedMessage,
    isTyping,
    messages,
    dialogOptions,
    sidebarChats,
    chatEndRef,
    handleOptionClick,
    handleSendMessage,
    usedOptionKeys,
    t,
  } = useChat();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-black dark:text-white select-none">
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <Sidebar
          sidebarChats={sidebarChats}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isEn={isEn}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black relative">
          <Header
            name={t("toolbar.profile.name")}
            statusText={t("messages.statusOnline").replace(
              /iMessage\s*•\s*/i,
              "",
            )}
            avatarUrl="/profile.jpg"
          />

          <MessageThread
            messages={messages}
            isTyping={isTyping}
            chatEndRef={chatEndRef}
          />

          <ReplyOptions
            dialogOptions={dialogOptions}
            isTyping={isTyping}
            onOptionClick={handleOptionClick}
            usedOptionKeys={usedOptionKeys}
          />

          <InputForm
            typedMessage={typedMessage}
            setTypedMessage={setTypedMessage}
            isTyping={isTyping}
            onSubmit={handleSendMessage}
            placeholderText={t("messages.inputPlaceholder")}
          />
        </div>
      </div>
    </div>
  );
}
