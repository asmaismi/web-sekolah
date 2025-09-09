export type Major = {
  id: string;
  name: string;
  image_url?: string | null;
  desc?: string | null;
  slug?: string | null;
};

export async function listMajors(limit = 6): Promise<Major[]> {
  const mock: Major[] = [
    {
      id: "rpl",
      name: "Rekayasa Perangkat Lunak",
      desc: "Pemrograman, basis data, web & mobile.",
    },
    {
      id: "tkj",
      name: "Teknik Komputer & Jaringan",
      desc: "Jaringan, server, keamanan dasar.",
    },
    {
      id: "dkv",
      name: "Desain Komunikasi Visual",
      desc: "Desain grafis, ilustrasi, branding.",
    },
    {
      id: "akl",
      name: "Akuntansi & Keuangan Lembaga",
      desc: "Akuntansi dasar, perpajakan.",
    },
    {
      id: "tp",
      name: "Teknik Pemesinan",
      desc: "Produksi, CNC, gambar teknik.",
    },
    {
      id: "tbsm",
      name: "Teknik & Bisnis Sepeda Motor",
      desc: "Perawatan & perbaikan sepeda motor.",
    },
  ];
  return mock.slice(0, limit);
}
