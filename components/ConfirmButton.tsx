"use client";

export function ConfirmButton({ mensagem, children }: { mensagem: string; children: React.ReactNode }) {
  return (
    <button
      className="btn-danger"
      onClick={(e) => {
        if (!window.confirm(mensagem)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
