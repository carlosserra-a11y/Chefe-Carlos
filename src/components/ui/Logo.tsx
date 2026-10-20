type Props = {
  claro?: boolean;
  tamanho?: 'pequeno' | 'grande';
};

/** Assinatura tipográfica: "Chef" + "Carlos Jr" manuscrito + "Gastronomia". */
export function Logo({ claro = false, tamanho = 'pequeno' }: Props) {
  const cor = claro ? 'text-carrara' : 'text-tinta';
  const script = tamanho === 'grande' ? 'text-6xl' : 'text-[2.15rem]';
  return (
    <span className={`inline-flex flex-col items-center leading-none ${cor}`} aria-label="Chef Carlos Jr Gastronomia">
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.45em]" aria-hidden="true">Chef</span>
      <span className={`font-script ${script} -mt-0.5`} aria-hidden="true">Carlos Jr</span>
      <span className={`${tamanho === 'grande' ? 'mt-3' : 'mt-1'} text-[0.55rem] font-semibold uppercase tracking-[0.5em] text-ouro`} aria-hidden="true">
        Gastronomia
      </span>
    </span>
  );
}
