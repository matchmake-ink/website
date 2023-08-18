"use client";
import { useUser } from "@/lib/client/auth";
import { useState } from "react";
import { setProfile } from "@/lib/client/profile";
import Input from "./input";
import Modal from "./modal";
import Button from "./button";

export interface ProfileEditorProps {
  onFinishedSubmitting?: () => void;
}

export default function ProfileEditor({
  onFinishedSubmitting = () => {},
}: ProfileEditorProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { user, userLoading, userError } = useUser();
  const [ign, setIgn] = useState<string>("");
  const [discordTag, setdiscordTag] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const onSubmit = async () => {
    if (user === null || userLoading || userError) {
      return;
    }
    setSubmitting(true);

    await setProfile(user.uid, ign, discordTag);

    setSubmitting(false);
    onFinishedSubmitting();
  };

  return (
    <>
      <Button
        label="Update Profile"
        color="primary"
        onClick={() => setOpen(true)}
      />
      <Modal open={open} onClose={() => setOpen(false)} title="Update Profile">
        <form className="max-w-2xl flex flex-col justify-center">
          <Input
            label="IGN"
            type="text"
            value={ign}
            onChange={(value) => setIgn(value)}
          />
          <Input
            label="Discord Tag"
            type="text"
            value={discordTag}
            onChange={(value) => setdiscordTag(value)}
          />
          <Button
            label="Submit"
            color="primary"
            className="max-w-xs m-auto"
            onClick={onSubmit}
            disabled={
              submitting || userLoading || ign === "" || discordTag === ""
            }
          />
        </form>
      </Modal>
    </>
  );
}
