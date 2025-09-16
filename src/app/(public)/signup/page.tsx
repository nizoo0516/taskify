"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import Field from "@/components/form/Field";
import Input from "@/components/form/Input";
import MyButton from "@/components/common/Button";
import { Modal, ModalContext, ModalFooter } from "@/components/modal/Modal";
import { signup } from "@/features/users/api";

import { PasswordToggle, getPwError, getPwConfirmError } from "@/components/form/PasswordInput";

type Errors = { email?: string; nickname?: string; password?: string; confirm?: string };
type Keys = "email" | "nickname" | "password" | "confirm";

const trueEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const MAX_NICK = 10;
const MIN_PW = 8;

export default function SignupPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState({
    email: "",
    nickname: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dupModal, setDupModal] = useState(false);

  // 공통 onChange
  const onChange = (k: Keys) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((s) => ({ ...s, [k]: undefined }));
  };

  const onAgreeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValues((s) => ({ ...s, agree: e.target.checked }));
  };

  // Blur 검증
  const onBlurEmail = () =>
    setErrors((s) => ({
      ...s,
      email:
        !values.email || trueEmail(values.email) ? undefined : "이메일 형식으로 작성해 주세요.",
    }));

  const onBlurNickname = () =>
    setErrors((s) => ({
      ...s,
      nickname:
        !values.nickname || values.nickname.length <= MAX_NICK
          ? undefined
          : "열 자 이하로 작성해 주세요.",
    }));

  const onBlurPw = () =>
    setErrors((s) => ({
      ...s,
      password:
        getPwError(values.password) ?? // 길이 등 공통 규칙
        (values.password.length > 0 && values.password.length < MIN_PW
          ? "8자 이상 작성해 주세요."
          : undefined),
    }));

  const onBlurConfirm = () =>
    setErrors((s) => ({
      ...s,
      confirm: getPwConfirmError(values.password, values.confirm),
    }));

  // 버튼 활성화 조건
  const activeButton = useMemo(() => {
    const okEmail = trueEmail(values.email);
    const okNickname = values.nickname.length > 0 && values.nickname.length <= MAX_NICK;
    const okPw = values.password.length >= MIN_PW && !getPwError(values.password);
    const okConfirm =
      values.confirm.length > 0 && !getPwConfirmError(values.password, values.confirm);
    return okEmail && okNickname && okPw && okConfirm;
  }, [values]);

  const canSubmit = activeButton && values.agree && !submitting;

  // 제출
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    onBlurEmail();
    onBlurNickname();
    onBlurPw();
    onBlurConfirm();
    if (!activeButton || !values.agree) {
      setSubmitting(false);
      return;
    }

    try {
      await signup({
        email: values.email.trim(),
        nickname: values.nickname.trim(),
        password: values.password,
      });

      alert("가입이 완료되었습니다!");
      router.push("/login");
    } catch (err) {
      const status =
        typeof err === "object" && err !== null && "status" in err
          ? (err as { status?: unknown }).status
          : undefined;
      const message = err instanceof Error ? err.message : "회원가입에 실패했습니다.";

      if (status === 409 || message.includes("이미 사용중인")) {
        setDupModal(true);
      } else {
        alert(message);
      }
    } finally {
      setSubmitting(false);
      // 재제출 방지
      setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 0);
    }
  };

  return (
    <main className="pc:max-w-[520px] tablet:max-w-[520px] mx-auto flex h-screen w-full max-w-[351px] flex-col items-center justify-center">
      <Link href="/" className="mb-3 flex flex-col items-center gap-[5px]" aria-label="홈으로 이동">
        <Image src="/images/img-logo-large.svg" alt="Taskify 텍스트 로고" width={300} height={60} />
      </Link>

      <p className="mb-[30px] text-center text-xl text-[var(--text-primary)]">
        첫 방문을 환영합니다!
      </p>

      <form ref={formRef} onSubmit={onSubmit} className="w-full space-y-8">
        {/* 이메일 */}
        <Field id="email" label="이메일" error={errors.email}>
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력해 주세요."
            value={values.email}
            onChange={onChange("email")}
            onBlur={onBlurEmail}
          />
        </Field>

        {/* 닉네임 */}
        <Field id="nickname" label="닉네임" error={errors.nickname}>
          <Input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력해 주세요"
            value={values.nickname}
            onChange={onChange("nickname")}
            onBlur={onBlurNickname}
          />
        </Field>

        {/* 비밀번호 */}
        <Field id="password" label="비밀번호" error={errors.password}>
          <div className="relative">
            <Input
              id="password"
              aria-invalid={!!errors.password}
              aria-errormessage="password-error"
              type={showPw ? "text" : "password"}
              placeholder="비밀번호를 입력해 주세요"
              value={values.password}
              onChange={onChange("password")}
              onBlur={onBlurPw}
              rightIcon={
                <PasswordToggle
                  show={showPw}
                  onToggle={() => setShowPw((s) => !s)}
                  controlsId="password"
                />
              }
            />
          </div>
        </Field>

        {/* 비밀번호 확인 */}
        <Field id="confirm" label="비밀번호 확인" error={errors.confirm}>
          <div className="relative">
            <Input
              id="confirm"
              aria-invalid={!!errors.confirm}
              aria-errormessage="confirm-error"
              type={showPw ? "text" : "password"}
              placeholder="비밀번호를 한번 더 입력해 주세요"
              value={values.confirm}
              onChange={onChange("confirm")}
              onBlur={onBlurConfirm}
              rightIcon={
                <PasswordToggle
                  show={showPw}
                  onToggle={() => setShowPw((s) => !s)}
                  controlsId="confirm"
                />
              }
            />
          </div>
        </Field>

        {/* 약관 동의 */}
        <label className="flex items-center gap-2 text-[16px] text-[var(--text-primary)]">
          <input
            type="checkbox"
            checked={values.agree}
            onChange={onAgreeChange}
            className="h-4 w-4 accent-blue-600"
          />
          이용약관에 동의합니다.
        </label>

        <MyButton
          onClick={() => {
            if (!canSubmit) return;
            formRef.current?.requestSubmit();
          }}
          color={canSubmit ? "buttonBlue" : "buttonGrey"}
          className="h-[50px] w-full"
        >
          {submitting ? "가입 중" : "가입하기"}
        </MyButton>
      </form>

      {/* 하단 링크 */}
      <div className="mt-6 text-center text-[16px] text-[var(--text-primary)]">
        이미 회원이신가요?
        <Link
          href="/login"
          className="ml-1 text-[#2661E8] underline decoration-1 underline-offset-2"
        >
          로그인하기
        </Link>
      </div>

      {/* 중복 이메일 모달 */}
      {dupModal && (
        <Modal open={true} isOpenModal={setDupModal} size="sm">
          <ModalContext>
            <p className="text-center text-[var(--text-primary)]">이미 사용중인 이메일입니다</p>
          </ModalContext>
          <ModalFooter>
            <MyButton
              onClick={() => setDupModal(false)}
              color="buttonBlue"
              className="h-[50px] w-full text-white"
            >
              확인
            </MyButton>
          </ModalFooter>
        </Modal>
      )}
    </main>
  );
}
