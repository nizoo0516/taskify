"use client";

import { useState } from "react";

import { Modal, ModalHeader, ModalContext, ModalFooter } from "@/components/modal/Modal";
import { getDashboardInvitations, inviteToDashboard } from "@/features/dashboard/api";
import { useApiHandler } from "@/lib/useApiHandler";
import Field from "../form/Field";
import Input from "../form/Input";
import MyButton from "../common/Button";

type InviteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  dashboardId: number;
};

export default function InviteModal({ isOpen, onClose, dashboardId }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  // 초대목록 불러오기
  const { data: invitations, refetch: refetchInvitations } = useApiHandler(
    () => getDashboardInvitations(dashboardId, { page: 1, size: 50 }),
    [dashboardId],
  );

  // 초대하기
  const { loading, refetch } = useApiHandler(
    () => inviteToDashboard(dashboardId, { email }),
    [dashboardId],
    { autoFetch: false },
  );

  const handleInvite = async () => {
    try {
      setError(undefined);

      const invited = invitations?.invitations.some((invite) => invite.invitee.email === email);

      if (invited) {
        setError("이미 대시보드에 초대된 멤버입니다.");
        return;
      }

      await refetch();
      setEmail("");
      await refetchInvitations();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Modal
      open={isOpen}
      isOpenModal={() => onClose()}
      className="tablet:w-full w-[calc(100%-32px)] max-w-[568px] min-w-0"
    >
      <div className="w-full">
        <ModalHeader title="초대하기" onClose={onClose} />
        <ModalContext>
          <Field id="inviteEmail" label="이메일" error={error}>
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(undefined);
              }}
            />
          </Field>
        </ModalContext>
        <ModalFooter>
          <div className="flex h-[54px] w-full justify-center gap-2">
            <MyButton
              className="bg-brand-gray-200 text-brand-gray-700 border-brand-gray-200 flex-1 border-0 text-lg font-medium"
              onClick={onClose}
            >
              취소
            </MyButton>
            <MyButton
              className="bg-brand-blue-500 flex-1 border-0 text-white"
              onClick={handleInvite}
            >
              {loading ? "초대 중..." : "초대"}
            </MyButton>
          </div>
        </ModalFooter>
      </div>
    </Modal>
  );
}
