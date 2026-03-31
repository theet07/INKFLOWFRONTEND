/* src/mocks.js
 * Arquivo de Mock de Dados (Contratos pré-estabelecidos com a IA do Backend)
 */

export const mockArtistas = [
  {
    id: "uuid-1",
    nome: "Marina Silva",
    foto_perfil: "https://randomuser.me/api/portraits/women/44.jpg",
    bio_curta: "Especialista em fine line e tatuagens delicadas, transformando ideias em traços eternos.",
    especialidades: ["Fine Line", "Minimalista"],
    cidade: "São Paulo",
    estado: "SP",
    avaliacao_media: 4.9,
    total_avaliacoes: 127,
    preco_medio: 350
  },
  {
    id: "uuid-2",
    nome: "Carlos Eduardo",
    foto_perfil: "https://randomuser.me/api/portraits/men/32.jpg",
    bio_curta: "Mestre em realismo e sombreado. Mais de 10 anos de experiência com artes de grandes proporções.",
    especialidades: ["Realismo", "Sombreado", "Preto e Cinza"],
    cidade: "Rio de Janeiro",
    estado: "RJ",
    avaliacao_media: 4.8,
    total_avaliacoes: 84,
    preco_medio: 500
  },
  {
    id: "uuid-3",
    nome: "Alexandre 'Skull'",
    foto_perfil: "https://randomuser.me/api/portraits/men/46.jpg",
    bio_curta: "Old School raiz. Cores sólidas, traços grossos e designs clássicos que duram uma vida toda.",
    especialidades: ["Old School", "Tradicional"],
    cidade: "Curitiba",
    estado: "PR",
    avaliacao_media: 4.7,
    total_avaliacoes: 210,
    preco_medio: 250
  }
];

// O objeto abaixo simula o endpoint GET /api/artistas/:id retornando os dados detalhados
export const mockArtistaDetalhe = {
  "uuid-1": {
    id: "uuid-1",
    nome: "Marina Silva",
    foto_perfil: "https://randomuser.me/api/portraits/women/44.jpg",
    bio_curta: "Especialista em fine line e tatuagens delicadas.",
    bio_completa: "Sou apaixonada pela arte de eternizar histórias na pele. Com mais de 5 anos de experiência, procuro sempre entender a fundo a motivação do cliente para criar o desenho perfeito, utilizando as melhores tintas e técnicas do mercado.",
    especialidades: ["Fine Line", "Minimalista"],
    cidade: "São Paulo",
    estado: "SP",
    avaliacao_media: 4.9,
    total_avaliacoes: 127,
    preco_medio: 350,
    portfolio: [
      { id: "img-1", foto: "https://images.unsplash.com/photo-1598371839696-5e5bb00b059e?q=80&w=600&auto=format&fit=crop", estilo: "Fine Line" },
      { id: "img-2", foto: "https://images.unsplash.com/photo-1611501275019-9b5cda99408b?q=80&w=600&auto=format&fit=crop", estilo: "Minimalista" },
      { id: "img-3", foto: "https://images.unsplash.com/photo-1560528659-679900f6825f?q=80&w=600&auto=format&fit=crop", estilo: "Floral" }
    ],
    horarios_semana: "09:00-18:00",
    horarios_sabado: "09:00-14:00",
    horarios_domingo: "Fechado",
    politica_sinal: 50,
    politica_cancelamento_horas: 24,
    redes_sociais: { instagram: "https://instagram.com/marinatattoo", tiktok: "https://tiktok.com/@marinatattoo" }
  }
};
