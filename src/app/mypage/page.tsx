"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import Field from "@/components/form/Field";
import Input from "@/components/form/Input";
import MyButton from "@/components/common/Button";
import { changePassword } from "@/features/auth/api";
import { getMe, updateMe, uploadProfileImage } from "@/features/users/api";
import {
  SignupResponse,
  UpdateUserRequest,
  UploadProfileImageResponse,
} from "@/features/users/types";

export default function AccountPage() {
  const router = useRouter();

  const [myData, setMyData] = useState<SignupResponse | null>(null);
  const [nickname, setNickname] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);

  // 내 정보 로딩
  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setMyData(me);
        setNickname(me.nickname ?? "");
        setProfileUrl(me.profileImageUrl ?? null);
      } catch (e) {
        console.warn(e);
        alert("계정 정보를 불러오지 못했습니다.");
      }
    })();
  }, []);

  // 프로필 이미지 업로드
  const onPick = () => fileRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\/(png|jpeg)$/.test(f.type)) {
      alert("PNG 또는 JPG 이미지만 업로드할 수 있습니다.");
      return;
    }
    setPendingFile(f);
    setProfileUrl(URL.createObjectURL(f));
  };

  // 블러 시 비밀번호 검사
  const onBlurConfirm = () => {
    setError(!confirmPw || confirmPw === newPw ? undefined : "비밀번호가 일치하지 않습니다.");
  };

  // 프로필 저장 버튼 활성화 조건
  const canSaveProfile = useMemo(() => {
    if (!myData) return false;
    const nickchanged = nickname.trim() !== (myData.nickname ?? "");
    const fileChanged = !!pendingFile;
    return nickchanged || fileChanged;
  }, [myData, nickname, pendingFile]);

  // 비밀번호 변경 버튼 활성화 조건
  const canChange = useMemo(
    () => curPw.length > 0 && newPw.length > 0 && confirmPw.length > 0 && !error,
    [curPw, newPw, confirmPw, error],
  );

  // 프로필 저장 로직
  const onSaveProfile = async () => {
    if (!myData || !canSaveProfile || saving) return;
    try {
      setSaving(true);
      let imageUrl: string | undefined = myData.profileImageUrl;

      if (pendingFile) {
        const fd = new FormData();
        fd.append("image", pendingFile);
        const up: UploadProfileImageResponse = await uploadProfileImage(fd);
        imageUrl = up.profileImageUrl ?? imageUrl;
      }

      const payload: UpdateUserRequest = {
        nickname: nickname.trim(),
        ...(imageUrl !== undefined ? { profileImageUrl: imageUrl } : {}),
      };

      const updated = await updateMe(payload);
      setMyData(updated);
      setNickname(updated.nickname ?? "");
      setProfileUrl(updated.profileImageUrl ?? null);
      setPendingFile(null);
      alert("프로필이 저장되었습니다.");
    } catch (e) {
      console.warn(e);
      alert("프로필 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 비밀번호 변경 로직
  const onChangePw = async () => {
    if (!canChange || changing) return;
    try {
      setChanging(true);
      await changePassword({ password: curPw, newPassword: newPw });
      alert("비밀번호가 변경되었습니다.");
      setCurPw("");
      setNewPw("");
      setConfirmPw("");
      setError(undefined);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "비밀번호 변경 실패";
      if (msg.includes("현재 비밀번호")) {
        alert("현재 비밀번호가 틀립니다");
      } else {
        alert(msg);
      }
    } finally {
      setChanging(false);
    }
  };

  return (
    <main className="pc:max-w-[720px] tablet:max-w-[548px] flex w-full max-w-full flex-col gap-6 p-5">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-[5px] flex items-center gap-[3px] text-lg text-[#333236]"
      >
        <Image src="/icons/icon-arrow-left.svg" alt="돌아가기 아이콘" width={20} height={20} />
        돌아가기
      </button>
      <section className="w-full rounded-2xl bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold text-[#333236]">프로필</h2>
        <div className="tablet:flex-row pc:flew-row flex flex-col gap-[42px]">
          <div className="w-[182px] flex-shrink-0">
            <button
              type="button"
              onClick={onPick}
              className="flex h-[182px] w-[182px] items-center justify-center rounded-md"
              aria-label="프로필 이미지 업로드"
            >
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt="프로필 미리보기"
                  width={182}
                  height={182}
                  className="rounded-[6px] object-cover"
                />
              ) : (
                <Image
                  src="/icons/icon-add-blue.svg"
                  alt="프로필 추가 아이콘"
                  width={30}
                  height={30}
                />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          <div className="w-full space-y-4">
            <Field
              id="email"
              label="이메일"
              className="[&_input]:text-lg [&_input]:read-only:!text-[#9FA6B2] [&>label]:text-lg [&>label]:text-[#333236]"
            >
              <Input value={myData?.email ?? ""} readOnly />
            </Field>

            <Field
              id="nickname"
              label="닉네임"
              className="[&>label]:text-lg [&>label]:text-[#333236]"
            >
              <Input
                value={nickname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
                placeholder={myData?.nickname ?? "닉네임 입력"}
              />
            </Field>

            <MyButton
              onClick={onSaveProfile}
              color={canSaveProfile && !saving ? "buttonBlue" : "buttonGrey"}
              className={`mt-6 h-[54px] w-full text-white`}
            >
              {saving ? "저장 중" : "저장"}
            </MyButton>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold text-[#333236]">비밀번호 변경</h2>

        <div className="space-y-4">
          <Field
            id="currentPw"
            label="현재 비밀번호"
            className="[&>label]:text-lg [&>label]:text-[#333236]"
          >
            <Input
              type="password"
              name="current-password"
              autoComplete="current-password"
              value={curPw}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurPw(e.target.value)}
              placeholder="비밀번호 입력"
            />
          </Field>
          <Field
            id="newPw"
            label="새 비밀번호"
            className="[&>label]:text-lg [&>label]:text-[#333236]"
          >
            <Input
              type="password"
              name="new-password"
              autoComplete="new-password"
              value={newPw}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPw(e.target.value)}
              placeholder="새 비밀번호 입력"
            />
          </Field>
          <Field
            id="confirmPw"
            label="새 비밀번호 확인"
            error={error}
            className="[&>label]:text-lg [&>label]:text-[#333236]"
          >
            <Input
              type="password"
              name="new-password-confirm"
              autoComplete="new-password-confirm"
              value={confirmPw}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setConfirmPw(e.target.value);
                if (error) setError(undefined);
              }}
              onBlur={onBlurConfirm}
              aria-invalid={!!error}
              className={error ? "border-red-500" : ""}
              placeholder="새 비밀번호 입력"
            />
          </Field>

          <MyButton
            onClick={onChangePw}
            color={canChange && !changing ? "buttonBlue" : "buttonGrey"}
            className={`mt-6 h-[54px] w-full text-white`}
          >
            {changing ? "변경 중" : "변경"}
          </MyButton>
        </div>
      </section>
    </main>
  );
}
