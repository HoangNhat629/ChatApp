import { useAppStore } from "../store/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "../utils/constants";
import { getColor } from "../lib/utils";
const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages,
  } = useAppStore();
  const handleClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
      setSelectedChatData(contact);
    } else {
      setSelectedChatType("contact");
      setSelectedChatData(contact);
    }
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    className="object-cover h-full w-full bg-black"
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                  />
                ) : (
                  <div
                    className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${
                      selectedChatData && selectedChatData._id === contact._id
                        ? "bg-[ffffff22] border border-white/70"
                        : getColor(contact.color)
                    }`}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="flex bg-[#ffffff22] h-10 w-10 items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>
                {contact.firstName && contact.lastName
                  ? `${contact.firstName} ${contact.lastName}`
                  : `${contact.email}`}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;