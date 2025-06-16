"use client";


import Account from "@/components/Settings-comps/Account";
import Apikeys from "@/components/Settings-comps/Apikeys";
import Attachments from "@/components/Settings-comps/Attachments";
import Contact from "@/components/Settings-comps/Contact";
import Customization from "@/components/Settings-comps/Customization";
import HistoryAndSync from "@/components/Settings-comps/HistoryAndSync";
import Models from "@/components/Settings-comps/Models";
import NotFound from "@/components/Settings-comps/NotFound";
import { useParams } from "next/navigation";


export default function Page() {
  const { menuItems } = useParams();
  let content;
  if (menuItems === 'account') {
    content = <Account />;
  } else if (menuItems === 'customization') {
    content = <Customization />;
  } else if (menuItems === 'history') {
    content = <HistoryAndSync />;
  } else if (menuItems === 'models') {
    content = <Models />;
  } else if (menuItems === 'api-keys') {
    content = <Apikeys />;
  } else if (menuItems === 'attachments') {
    content = <Attachments />;
  } else if (menuItems === 'contact') {
    content = <Contact />;
  }else {
    content = <NotFound />;
  }

  return (
    <div className="mt-2">
      {content}
    </div>
  );
}

