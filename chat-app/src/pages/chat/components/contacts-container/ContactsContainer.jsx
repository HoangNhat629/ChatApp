import ProfileInfo from "./components/profile-info/ProfileInfo";
import NewDM from "./components/new-dm/NewDm";
import {
  GET_DM_CONTACTS_ROUTES,
  GET_USER_CHANNEL_ROUTE,
} from "../../../../utils/constants";
import { useEffect } from "react";
import { apiClient } from "../../../../lib/api-client";
import { useAppStore } from "../../../../store/store";
import ContactList from "../../../../components/contact-list";
import CreateChannel from "./components/create-channel/CreateChannel";
const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="78"
        height="32"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#E9577A"
          d="m430.121 76.219-4.281 20.559c-.195 8.434-7.047 15.223-15.516 15.223-8.594 0-15.578-6.961-15.578-15.555 0-1.512.273-2.965.68-4.344l4.5-21.488C404.332 49.512 393.684 32 376.012 32H96c-17.664 0-32 17.512-32 38.613v381.942C64 467.727 76.273 480 91.445 480c7.695 0 14.539-3.281 19.523-8.398l82.289-99.18C204.953 359.891 221.516 352 240.004 352h75.094c14.312 0 28.352-11.695 31.438-26.414l17.531-83.742c.062-.621.195-1.223.195-1.844 0-8.844-7.18-16-16-16H208c-8.844 0-16-7.156-16-16s7.156-16 16-16h139.004c26.508 0 48 21.488 48 48 0 3.082-.297 6.129-.875 9.039l-16.992 81.547C370.895 360.516 342.871 384 314.301 384h-72.805c-9.426 0-17.848 4.148-23.699 10.648l-80.547 96.656C126.234 503.953 110.062 512 92.008 512 58.859 512 32 485.141 32 451.992V76.219C32 34.852 60.648 0 96 0h286.004c35.336 0 56.726 34.852 48.117 76.219zm-46.117 75.769c0-8.824 7.156-15.996 16-15.996s16 7.172 16 15.996c0 8.848-7.156 16.004-16 16.004s-16-7.156-16-16.004z"
        />
      </svg>
      <span className="text-2xl font-semibold">Finn Messages</span>
    </div>
  );
};
const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
const ContactsContainer = () => {
  const {
    directMessagesContacts,
    setDirectMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();
  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
          withCredentials: true,
        });
        if (res.data.contacts) {
          setDirectMessagesContacts(res.data.contacts);
        }
      } catch (error) {
        console.error(
          "Error during save changes:",
          error.response ? error.response.data : error.message
        );
      }
    };
    const getChannels = async () => {
      try {
        const res = await apiClient.get(GET_USER_CHANNEL_ROUTE, {
          withCredentials: true,
        });
        if (res.data.channels) {
          setChannels(res.data.channels);
        }
      } catch (error) {
        console.error(
          "Error during:",
          error.response ? error.response.data : error.message
        );
      }
    };
    getChannels();
    getContacts();
  }, [setChannels, setDirectMessagesContacts]);
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <Logo />
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hide">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hide">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;
