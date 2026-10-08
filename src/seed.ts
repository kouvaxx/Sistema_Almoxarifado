import type { Category, Product, Supplier } from './types';

export const CATEGORY_META: Record<string,{icon:string;tone:string}> = {
  'Iluminação': {icon:'Lâmpada',tone:'amber'},
  'Elétrica': {icon:'Raio',tone:'emerald'},
  'Pneumática e Conexões': {icon:'Conector',tone:'blue'},
  'Fixação e Clips': {icon:'Parafuso',tone:'violet'},
  'Ferramentas e Abrasivos': {icon:'Ferramenta',tone:'rose'},
  'Tintas, Resinas e Pintura': {icon:'Pintura',tone:'pink'},
  'Adesivos e Vedantes': {icon:'Caixa',tone:'teal'},
  'Limpeza e Lubrificantes': {icon:'Gota',tone:'cyan'},
  'Fluidos Automotivos': {icon:'Barril',tone:'orange'},
  'Soldagem e Maçarico': {icon:'Fogo',tone:'red'},
  'EPI e Segurança': {icon:'Capacete',tone:'lime'},
  'Outros': {icon:'Lista',tone:'slate'}
};

const RAW_PRODUCTS = [
  {
    "id": "12322",
    "nome": "COLA DE CONTATO BRASPLAST",
    "fornecedor": "INOVAÇÃO TINTAS",
    "preco": 10.9,
    "quantidade": 1,
    "total": 10.9,
    "categoria": "Adesivos e Vedantes"
  },
  {
    "id": "32490",
    "nome": "FITA DUPLA FACE 3M 12X20 VERDE",
    "fornecedor": "INOVAÇÃO TINTAS",
    "preco": 65.9,
    "quantidade": 1,
    "total": 65.9,
    "categoria": "Adesivos e Vedantes"
  },
  {
    "id": "33054",
    "nome": "FIXADOR ADESIVO UNIVERSAL (PCT 50UN)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 33.74,
    "quantidade": 1,
    "total": 33.74,
    "categoria": "Adesivos e Vedantes"
  },
  {
    "id": "16561",
    "nome": "SOLUCAO DESENGRAXANTE 0.900 MAXI RUBBER (12UN CAIXA FECHADA)",
    "fornecedor": "INOVAÇÃO TINTAS",
    "preco": 22.9,
    "quantidade": 12,
    "total": 274.8,
    "categoria": "Limpeza e Lubrificantes"
  },
  {
    "id": "33051",
    "nome": "GRAXA DE CAVIDADE SPRAY 200 ML",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 28.16,
    "quantidade": 1,
    "total": 28.16,
    "categoria": "Limpeza e Lubrificantes"
  },
  {
    "id": "37720",
    "nome": "LIMPA CONTATO 300ML",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 17.9,
    "quantidade": 1,
    "total": 17.9,
    "categoria": "Limpeza e Lubrificantes"
  },
  {
    "id": "23648",
    "nome": "DESENGRIPANTE ROST OFF 900ML (12UN CAIXA FECHADA)",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 26.99,
    "quantidade": 12,
    "total": 323.88,
    "categoria": "Limpeza e Lubrificantes"
  },
  {
    "id": "38461",
    "nome": "SPRAY ZINCO BRILHANTE 400ML",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 99.94,
    "quantidade": 1,
    "total": 99.94,
    "categoria": "Tintas, Resinas e Pintura"
  },
  {
    "id": "30984",
    "nome": "ABRAC 30CM P/CHASSI 6MM (50PCS)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 43.41,
    "quantidade": 1,
    "total": 43.41,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "34667",
    "nome": "ABRAC 40CM UV PRETA 7,5MM GRANDE (50PCS)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 74.49,
    "quantidade": 1,
    "total": 74.49,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "36712",
    "nome": "ABRAC 40CM UV PRETA 4,8MM MEDIA (50PCS)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 42.04,
    "quantidade": 1,
    "total": 42.04,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "23766",
    "nome": "ABRAC 20CM UV PRETA 3,7MM PEQUENA (50PCS)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 12.07,
    "quantidade": 1,
    "total": 12.07,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "37151",
    "nome": "FFADOT3 COBREQ FLUIDO DOT3 500ML COR AZUL EMB C/24 008D2",
    "fornecedor": "DISAUTO AUTO PEÇAS",
    "preco": 15.67,
    "quantidade": 1,
    "total": 15.67,
    "categoria": "Fluidos Automotivos"
  },
  {
    "id": "37152",
    "nome": "FFADOT4 COBREQ FLUIDO DOT4 500 ML VERMELHA EMB C/ 076C2",
    "fornecedor": "DISAUTO AUTO PEÇAS",
    "preco": 21.59,
    "quantidade": 1,
    "total": 21.59,
    "categoria": "Fluidos Automotivos"
  },
  {
    "id": "23734",
    "nome": "PETRO COOLANT UP 1L - LIQUIDO",
    "fornecedor": "SCHERER S/A",
    "preco": 23.46,
    "quantidade": 1,
    "total": 23.46,
    "categoria": "Fluidos Automotivos"
  },
  {
    "id": "19231",
    "nome": "ÓLEO HIDRAULICO ATF DH",
    "fornecedor": "DISAUTO AUTO PEÇAS",
    "preco": 23.26,
    "quantidade": 1,
    "total": 23.26,
    "categoria": "Fluidos Automotivos"
  },
  {
    "id": "28916",
    "nome": "SINTRA PRO 5L VONIXX",
    "fornecedor": "SMB TINTAS",
    "preco": 74.9,
    "quantidade": 1,
    "total": 74.9,
    "categoria": "Limpeza e Lubrificantes"
  },
  {
    "id": "36883",
    "nome": "GAS BUTANO P/MACARICO 227GR CAMPGAS NTK",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 16.5,
    "quantidade": 1,
    "total": 16.5,
    "categoria": "Soldagem e Maçarico"
  },
  {
    "id": "13223",
    "nome": "DISFUSOR SU220",
    "fornecedor": "SOLDAMIG MAN",
    "preco": 39.85,
    "quantidade": 1,
    "total": 39.85,
    "categoria": "Soldagem e Maçarico"
  },
  {
    "id": "13222",
    "nome": "TUBO DE CONTATO 0,8MM SU220",
    "fornecedor": "SOLDAMIG MAN",
    "preco": 9.65,
    "quantidade": 1,
    "total": 9.65,
    "categoria": "Soldagem e Maçarico"
  },
  {
    "id": "13224",
    "nome": "ISOLADOR DIFUSOR SU220",
    "fornecedor": "SOLDAMIG MAN",
    "preco": 35.8,
    "quantidade": 1,
    "total": 35.8,
    "categoria": "Soldagem e Maçarico"
  },
  {
    "id": "13221",
    "nome": "BOCAL SU220",
    "fornecedor": "SOLDAMIG MAN",
    "preco": 69.9,
    "quantidade": 1,
    "total": 69.9,
    "categoria": "Soldagem e Maçarico"
  },
  {
    "id": "18589",
    "nome": "ANTI RESPINGO GEL OXIMIG",
    "fornecedor": "SOLDAMIG MAN",
    "preco": 29.4,
    "quantidade": 1,
    "total": 29.4,
    "categoria": "Limpeza e Lubrificantes"
  },
  {
    "id": "20334",
    "nome": "VARETA FERRO COBREADO 2,38 MM - 3/32\"",
    "fornecedor": "WALENDOWSKY (2021)",
    "preco": 16.0,
    "quantidade": 1,
    "total": 16.0,
    "categoria": "Soldagem e Maçarico"
  },
  {
    "id": "31640",
    "nome": "DUPLA FACE",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 219.9,
    "quantidade": 1,
    "total": 219.9,
    "categoria": "Adesivos e Vedantes"
  },
  {
    "id": "30960",
    "nome": "SPRAY PRETO SEMI BRILHO 400ML",
    "fornecedor": "AUTO CORES ITAJAÍ",
    "preco": 25.0,
    "quantidade": 1,
    "total": 25.0,
    "categoria": "Tintas, Resinas e Pintura"
  },
  {
    "id": "30960",
    "nome": "SPRAY PRETO FOSCO 400ML",
    "fornecedor": "AUTO CORES ITAJAÍ",
    "preco": 25.0,
    "quantidade": 1,
    "total": 25.0,
    "categoria": "Tintas, Resinas e Pintura"
  },
  {
    "id": "21008",
    "nome": "FITA CREPE 48X40 VERDE (GRANDE)",
    "fornecedor": "EP PRESTADORA DE SERVIÇOS",
    "preco": 12.5,
    "quantidade": 1,
    "total": 12.5,
    "categoria": "Adesivos e Vedantes"
  },
  {
    "id": "18724",
    "nome": "FITA CREPE TESA 18X40 VERDE (PEQUENA)",
    "fornecedor": "SMB TINTAS",
    "preco": 3.89,
    "quantidade": 1,
    "total": 3.89,
    "categoria": "Adesivos e Vedantes"
  },
  {
    "id": "13812",
    "nome": "ESCOVA DE ACO MANUAL CABO PLASTICO VERMELHO PEQUI",
    "fornecedor": "FEMATEL",
    "preco": 15.3,
    "quantidade": 1,
    "total": 15.3,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "14646",
    "nome": "SERRA MANUAL RS 1224 STARRETT (20UN)",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 10.75,
    "quantidade": 20,
    "total": 215.0,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "23939",
    "nome": "LAMINA SERRA SABRE BT121014",
    "fornecedor": "FEMATEL (2020)",
    "preco": 19.9,
    "quantidade": 1,
    "total": 19.9,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "26.01.020",
    "nome": "CERA DE CAVIDADE CAVITEX ROBERLO 1L (JARDEL)",
    "fornecedor": "NEON COMERCIO DE TINTAS LTDA",
    "preco": 143.83,
    "quantidade": 1,
    "total": 143.83,
    "categoria": "Limpeza e Lubrificantes"
  },
  {
    "id": "14433",
    "nome": "PROTETOR ANTICORROSIVO 900ml BEMIL BM108",
    "fornecedor": "TINTOMETRICA (J2 COSTA)",
    "preco": 135.0,
    "quantidade": 1,
    "total": 135.0,
    "categoria": "Limpeza e Lubrificantes"
  },
  {
    "id": "12661",
    "nome": "COLA RESTAURA TUDO (KIT RECUPERADOR DE PARA-CHOQUE) HF IND - CX C/ 30UN",
    "fornecedor": "HF INDUSTRIA",
    "preco": 27.2,
    "quantidade": 30,
    "total": 816.0,
    "categoria": "Tintas, Resinas e Pintura"
  },
  {
    "id": "16125",
    "nome": "MANTA DE FIBRA DE VIDRO 450g/M - 0,50 kg 1,2m",
    "fornecedor": "MUNDO DAS FIBRAS",
    "preco": 34.9,
    "quantidade": 1,
    "total": 34.9,
    "categoria": "Tintas, Resinas e Pintura"
  },
  {
    "id": "16124",
    "nome": "ACELERADOR DE COBALTO 0,090 kg",
    "fornecedor": "MUNDO DAS FIBRAS",
    "preco": 21.9,
    "quantidade": 1,
    "total": 21.9,
    "categoria": "Tintas, Resinas e Pintura"
  },
  {
    "id": "16126",
    "nome": "CATALISADOR MEKP BRASNOX DM-50 -",
    "fornecedor": "MUNDO DAS FIBRAS",
    "preco": 39.9,
    "quantidade": 1,
    "total": 39.9,
    "categoria": "Tintas, Resinas e Pintura"
  },
  {
    "id": "16124",
    "nome": "RESINA ACELERADA POLIESTER - 1,000 Kg",
    "fornecedor": "MUNDO DAS FIBRAS",
    "preco": 29.9,
    "quantidade": 1,
    "total": 29.9,
    "categoria": "Tintas, Resinas e Pintura"
  },
  {
    "id": "32517",
    "nome": "LUVA PROCEDIMENTO SUPERGLOVE PRETA TAM 9 CA 38645 SAFET - 1CX (50UN)",
    "fornecedor": "INOVAÇÃO TINTAS",
    "preco": 70.0,
    "quantidade": 1,
    "total": 70.0,
    "categoria": "EPI e Segurança"
  },
  {
    "id": "38313",
    "nome": "ESPAGUETE TERMORETRATIL 3,0 MM>1,5MM PRETO",
    "fornecedor": "VERTRAUEN",
    "preco": 2.39,
    "quantidade": 1,
    "total": 2.39,
    "categoria": "Elétrica"
  },
  {
    "id": "?",
    "nome": "ADESIVO PARA JUNTO ALTA TEMPERATURA",
    "fornecedor": "?",
    "preco": 0.0,
    "quantidade": 0,
    "total": 0.0,
    "categoria": "Adesivos e Vedantes"
  },
  {
    "id": "33712",
    "nome": "H1 12V 55W P14.5S",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 8.5,
    "quantidade": 1,
    "total": 8.5,
    "categoria": "Iluminação"
  },
  {
    "id": "33713",
    "nome": "H3 12V 55W PL22S",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 7.76,
    "quantidade": 1,
    "total": 7.76,
    "categoria": "Iluminação"
  },
  {
    "id": "24297",
    "nome": "H4 12V 60/55W P43T",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 8.65,
    "quantidade": 1,
    "total": 8.65,
    "categoria": "Iluminação"
  },
  {
    "id": "25089",
    "nome": "H7 12V 55W PX26D",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 14.89,
    "quantidade": 1,
    "total": 14.89,
    "categoria": "Iluminação"
  },
  {
    "id": "34784",
    "nome": "LAMP 3893 12V 4W BA9S",
    "fornecedor": "DM MIROCAR",
    "preco": 1.28,
    "quantidade": 10,
    "total": 12.8,
    "categoria": "Iluminação"
  },
  {
    "id": "33717",
    "nome": "6418 12V 5W SV8.5-8 (TORPEDO)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 2.1,
    "quantidade": 10,
    "total": 21.0,
    "categoria": "Iluminação"
  },
  {
    "id": "33164",
    "nome": "5007 12V 5W BA15S",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 1.24,
    "quantidade": 10,
    "total": 12.4,
    "categoria": "Iluminação"
  },
  {
    "id": "33715",
    "nome": "12V 1-2W W2X4.6D (PINGUINHO)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 1.21,
    "quantidade": 10,
    "total": 12.1,
    "categoria": "Iluminação"
  },
  {
    "id": "37349",
    "nome": "2821 12V 3W W2.1X9.5D (PINGO)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 1.12,
    "quantidade": 10,
    "total": 11.2,
    "categoria": "Iluminação"
  },
  {
    "id": "33165",
    "nome": "7528 12V 21/5W DOIS POLOS",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 1.67,
    "quantidade": 10,
    "total": 16.7,
    "categoria": "Iluminação"
  },
  {
    "id": "37083",
    "nome": "7507 12V 21W BAU15S (LARANJA)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 3.98,
    "quantidade": 10,
    "total": 39.8,
    "categoria": "Iluminação"
  },
  {
    "id": "33162",
    "nome": "7506 12V 21W BA15S",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 1.37,
    "quantidade": 10,
    "total": 13.7,
    "categoria": "Iluminação"
  },
  {
    "id": "25561",
    "nome": "H21W 24V BAY9s",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 16.17,
    "quantidade": 1,
    "total": 16.17,
    "categoria": "Iluminação"
  },
  {
    "id": "34131",
    "nome": "H1 24V 70W P14.5s",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 10.11,
    "quantidade": 1,
    "total": 10.11,
    "categoria": "Iluminação"
  },
  {
    "id": "23778",
    "nome": "H3 24V 70W PK22s",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 11.23,
    "quantidade": 1,
    "total": 11.23,
    "categoria": "Iluminação"
  },
  {
    "id": "23779",
    "nome": "H4 24V 75/70W P43T",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 12.69,
    "quantidade": 1,
    "total": 12.69,
    "categoria": "Iluminação"
  },
  {
    "id": "34788",
    "nome": "3930 24V 4W BA9S",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 1.28,
    "quantidade": 10,
    "total": 12.8,
    "categoria": "Iluminação"
  },
  {
    "id": "34457",
    "nome": "5627 24V 5W BA15S (MÉDIA)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 1.23,
    "quantidade": 10,
    "total": 12.3,
    "categoria": "Iluminação"
  },
  {
    "id": "34488",
    "nome": "7511 24V 5W BA15S",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 1.93,
    "quantidade": 10,
    "total": 19.3,
    "categoria": "Iluminação"
  },
  {
    "id": "33414",
    "nome": "7510LTS 24V 21W BAU15S",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 8.34,
    "quantidade": 10,
    "total": 83.4,
    "categoria": "Iluminação"
  },
  {
    "id": "34788",
    "nome": "6423 24V 5W SV8.5-8 (TORPEDO)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 2.96,
    "quantidade": 10,
    "total": 29.6,
    "categoria": "Iluminação"
  },
  {
    "id": "34678",
    "nome": "2741 24V 5W W2.1X9 5D (PINGUINHO)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 1.37,
    "quantidade": 10,
    "total": 13.7,
    "categoria": "Iluminação"
  },
  {
    "id": "36713",
    "nome": "(H1005) FUSIVEL LAMINA 5A",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 0.42,
    "quantidade": 10,
    "total": 4.2,
    "categoria": "Elétrica"
  },
  {
    "id": "38053",
    "nome": "(H2010) FUSIVEL LAMINA MINI 10A",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 0.44,
    "quantidade": 10,
    "total": 4.4,
    "categoria": "Elétrica"
  },
  {
    "id": "33167",
    "nome": "(H1015) FUSIVEL LAMINA 15A AZ",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 0.39,
    "quantidade": 10,
    "total": 3.9,
    "categoria": "Elétrica"
  },
  {
    "id": "?",
    "nome": "FUSIVEL LAMINA 20A",
    "fornecedor": "?",
    "preco": 0.0,
    "quantidade": 1,
    "total": 0.0,
    "categoria": "Elétrica"
  },
  {
    "id": "?",
    "nome": "FUSIVEL LAMINA 25A",
    "fornecedor": "?",
    "preco": 0.0,
    "quantidade": 1,
    "total": 0.0,
    "categoria": "Elétrica"
  },
  {
    "id": "31028",
    "nome": "ENGATE RAPIDO 1/2\" MACHO",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 26.98,
    "quantidade": 1,
    "total": 26.98,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "33909",
    "nome": "CONEXAO CANECA CLIP 12MM 5/8\" ACO RECOZIDO DUREZA 02",
    "fornecedor": "PACCINI E CIA",
    "preco": 1.75,
    "quantidade": 1,
    "total": 1.75,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "33908",
    "nome": "CONEXAO CANECA CLIP 12MM 5/8\" ACO RCOZIDO DUREZA 01",
    "fornecedor": "PACCINI E CIA",
    "preco": 2.18,
    "quantidade": 1,
    "total": 2.18,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "33907",
    "nome": "CONEXAO CANECA CLIP 10MM 1/2\" ACO RECOZIDO DUREZA 02",
    "fornecedor": "PACCINI E CIA",
    "preco": 1.57,
    "quantidade": 1,
    "total": 1.57,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "33906",
    "nome": "CONEXAO CANECA CLIP 10MM 1/2\" ACO RECOZIDO DUREZA 01",
    "fornecedor": "PACCINI E CIA",
    "preco": 1.58,
    "quantidade": 1,
    "total": 1.58,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "33905",
    "nome": "CONEXAO CANECA CLIP 08MM 13/32\" ACO RECOZIDO DUREZA 02",
    "fornecedor": "PACCINI E CIA",
    "preco": 1.58,
    "quantidade": 1,
    "total": 1.58,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "33904",
    "nome": "CONEXAO CANECA CLIP 08MM 13/32\" ACO RECOZIDO DUREZA 01",
    "fornecedor": "PACCINI E CIA",
    "preco": 1.57,
    "quantidade": 1,
    "total": 1.57,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "33903",
    "nome": "CONEXAO CANECA CLIP 06MM 5/16\" ACO RECOZIDO DUREZA 02",
    "fornecedor": "PACCINI E CIA",
    "preco": 1.22,
    "quantidade": 1,
    "total": 1.22,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "12468",
    "nome": "PINO PEM MACHO P/ENGATE RAPIDO RF200",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 3.96,
    "quantidade": 1,
    "total": 3.96,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "13087",
    "nome": "CONEXAO UNIAO PNEUMATICA 04mm",
    "fornecedor": "BRUSFER FERRAGENS (2023)",
    "preco": 3.67,
    "quantidade": 1,
    "total": 3.67,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "12480",
    "nome": "CONEXAO UNIAO PNEUMATICA 06mm",
    "fornecedor": "BRUSFER FERRAGENS (2023)",
    "preco": 2.28,
    "quantidade": 1,
    "total": 2.28,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "12481",
    "nome": "CONEXAO UNIAO PNEUMATICA 08MM",
    "fornecedor": "BRUSFER FERRAGENS (2023)",
    "preco": 3.18,
    "quantidade": 1,
    "total": 3.18,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "14903",
    "nome": "CONEXAO UNIAO PNEUMATICA 10MM",
    "fornecedor": "BRUSFER FERRAGENS (2023)",
    "preco": 3.8,
    "quantidade": 1,
    "total": 3.8,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "17650",
    "nome": "CONEXAO UNIAO PNEUMATICA 12MM PGR",
    "fornecedor": "BRUSFER FERRAGENS (2023)",
    "preco": 4.81,
    "quantidade": 1,
    "total": 4.81,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "13086",
    "nome": "CONEXAO REDUCAO 10MM X 8MM",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 7.38,
    "quantidade": 1,
    "total": 7.38,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "19171",
    "nome": "CONEXAO REDUCAO 8MM X 6MM",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 5.61,
    "quantidade": 1,
    "total": 5.61,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "15889",
    "nome": "CONEXAO RETA 1/2 BSP X 10MM RGR",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 10.82,
    "quantidade": 1,
    "total": 10.82,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "28614",
    "nome": "CONEXAO RETA 1/4 BSP X 10MM",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 9.72,
    "quantidade": 1,
    "total": 9.72,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "13089",
    "nome": "CONEXAO RETA 1/4X08MM",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 6.55,
    "quantidade": 1,
    "total": 6.55,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "33993",
    "nome": "CONEXAO RETA 1/8 BSP X 06MM PGR",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 6.5,
    "quantidade": 1,
    "total": 6.5,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "16704",
    "nome": "CONEXAO RETA 3/8 BSP X 10MM RGR",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 6.51,
    "quantidade": 1,
    "total": 6.51,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "32373",
    "nome": "CONEXÃO TEE IGUAL 06MM",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 6.98,
    "quantidade": 1,
    "total": 6.98,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "38456",
    "nome": "CONEXAO TEE IGUAL 10MM PDR",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 0.0,
    "quantidade": 1,
    "total": 0.0,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "19607",
    "nome": "CONEXAO UNIAO DESIGUAL 06MM X 04MM RGR",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 4.6,
    "quantidade": 1,
    "total": 4.6,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "19606",
    "nome": "CONEXAO UNIAO DESIGUAL 08MM X 06MM RGR",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 7.43,
    "quantidade": 1,
    "total": 7.43,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "13085",
    "nome": "CONEXAO UNIAO DESIGUAL 10MMX08MM (ADAPTADOR PARA \"Y\")",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 7.08,
    "quantidade": 1,
    "total": 7.08,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "19609",
    "nome": "CONEXAO UNIAO DESILGUA 12MM X 10MM RGR",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 6.99,
    "quantidade": 1,
    "total": 6.99,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "21703",
    "nome": "CONEXAO Y MACHO 1/4 BSP X 10MM RGR",
    "fornecedor": "BRUSFER FERRAGENS (2018)",
    "preco": 12.06,
    "quantidade": 1,
    "total": 12.06,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "36795",
    "nome": "PISTOLA MANGUEIRA LIMPEZA CABINE GATILHO",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 26.06,
    "quantidade": 1,
    "total": 26.06,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "22745",
    "nome": "PLUGUE MACHO UNIVERSAL 10A FAME",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 4.17,
    "quantidade": 1,
    "total": 4.17,
    "categoria": "Elétrica"
  },
  {
    "id": "15009",
    "nome": "SILICONE CONSTRUÇAO ACETICO INCOLOR 256GR TEK BOND",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 16.8,
    "quantidade": 1,
    "total": 16.8,
    "categoria": "Adesivos e Vedantes"
  },
  {
    "id": "16241",
    "nome": "SELANTE PU CONSTRUCAO 40 BRANCO 400GR CISER",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 22.69,
    "quantidade": 1,
    "total": 22.69,
    "categoria": "Adesivos e Vedantes"
  },
  {
    "id": "24464",
    "nome": "MASSA DE CALAFETAR MASTIK CMV500 TUBO 300ML",
    "fornecedor": "PONTUAL PARABRISAS (2022)",
    "preco": 35.0,
    "quantidade": 1,
    "total": 35.0,
    "categoria": "Adesivos e Vedantes"
  },
  {
    "id": "36983",
    "nome": "ESTOPA COR 1o QUALIDADE 25KG (R$3,60 KG)",
    "fornecedor": "ADANTEX IND",
    "preco": 3.6,
    "quantidade": 25,
    "total": 90.0,
    "categoria": "Limpeza e Lubrificantes"
  },
  {
    "id": "18423",
    "nome": "SAPATO INDUSTRIAL N 37 CA42631 S/CADARCO CONFORTO",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 89.5,
    "quantidade": 1,
    "total": 89.5,
    "categoria": "EPI e Segurança"
  },
  {
    "id": "18518",
    "nome": "SAPATO INDUSTRIAL N 38 CA42631 S/CADARCO CONFORTO",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 89.5,
    "quantidade": 1,
    "total": 89.5,
    "categoria": "EPI e Segurança"
  },
  {
    "id": "18421",
    "nome": "SAPATO INDUSTRIAL N 39 CA42631 S/CADARCO CONFORTO",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 89.5,
    "quantidade": 1,
    "total": 89.5,
    "categoria": "EPI e Segurança"
  },
  {
    "id": "18142",
    "nome": "SAPATO INDUSTRIAL N 40 CA42631 S/CADARCO CONFORTO",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 89.5,
    "quantidade": 1,
    "total": 89.5,
    "categoria": "EPI e Segurança"
  },
  {
    "id": "17967",
    "nome": "SAPATO INDUSTRIAL N 41 CA42631 S/CADARCO CONFORTO",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 89.5,
    "quantidade": 1,
    "total": 89.5,
    "categoria": "EPI e Segurança"
  },
  {
    "id": "18069",
    "nome": "SAPATO INDUSTRIAL N 42 CA42631 S/CADARCO CONFORTO",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 89.5,
    "quantidade": 1,
    "total": 89.5,
    "categoria": "EPI e Segurança"
  },
  {
    "id": "18726",
    "nome": "SAPATO INDUSTRIAL N 43 CA42631 S/CADARCO CONFORTO",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 89.5,
    "quantidade": 1,
    "total": 89.5,
    "categoria": "EPI e Segurança"
  },
  {
    "id": "18422",
    "nome": "SAPATO INDUSTRIAL N 44 CA42631 S/CADARCO CONFORTO",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 89.5,
    "quantidade": 1,
    "total": 89.5,
    "categoria": "EPI e Segurança"
  },
  {
    "id": "18423",
    "nome": "SAPATO INDUSTRIAL N 45 CA42631 S/CADARCO CONFORTO",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 89.5,
    "quantidade": 1,
    "total": 89.5,
    "categoria": "EPI e Segurança"
  },
  {
    "id": "37122",
    "nome": "(FI10) FITA ISOL ANTI CHAMA 10MT(ISOFLEX)",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 3.12,
    "quantidade": 1,
    "total": 3.12,
    "categoria": "Elétrica"
  },
  {
    "id": "31530",
    "nome": "(P111 19X20) FITA ISOLANTE TECIDO 19X20M PRETA",
    "fornecedor": "CUNHADOS ELETRICA",
    "preco": 35.58,
    "quantidade": 1,
    "total": 35.58,
    "categoria": "Elétrica"
  },
  {
    "id": "500900692",
    "nome": "PINO FORRO PEDAL PTO 709/1618/ATEGO/AXOR",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 1.45,
    "quantidade": 1,
    "total": 1.45,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "0500900707",
    "nome": "GRAMPO MOLD P.LAMA/ESTRIBO FH-FM",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 3.7,
    "quantidade": 1,
    "total": 3.7,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "2500669",
    "nome": "PINO FIXACAO REVESTIMENTO PORTA",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 0.4,
    "quantidade": 1,
    "total": 0.4,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "0500900270",
    "nome": "BUCHA PLACA/FORRO GOL/DUCAT/IVECO/WORKER",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 0.25,
    "quantidade": 1,
    "total": 0.25,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900680",
    "nome": "BUCHA PLACA/DESC BRACO VW 680/780/WORK",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 0.78,
    "quantidade": 1,
    "total": 0.78,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900148",
    "nome": "BUCHA MOLDURA PARALAMA FIAT AMARELA",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 1.95,
    "quantidade": 1,
    "total": 1.95,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "1500104",
    "nome": "GRAMPO REVESTIMENTO LATERAL/PORTA",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 0.34,
    "quantidade": 1,
    "total": 0.34,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900693",
    "nome": "BUCHA FORRO PEDAL PT 709/1618/ATEGO/AXOR",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 1.25,
    "quantidade": 1,
    "total": 1.25,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900680",
    "nome": "BUCHA PLACA/DESC BRACO VW 680/780/WORK",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 0.78,
    "quantidade": 1,
    "total": 0.78,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "0500900695",
    "nome": "PINO PAINEL INST/CX FUSIVEL FD CARGO/VW",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 2.95,
    "quantidade": 1,
    "total": 2.95,
    "categoria": "Elétrica"
  },
  {
    "id": "500900131",
    "nome": "GRAMPO FORRACAO CABINE FORD/VW CINZA",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 3.22,
    "quantidade": 1,
    "total": 3.22,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900132",
    "nome": "GRAMPO FORRACAO CABINE FORD/VW PRETO",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 2.44,
    "quantidade": 1,
    "total": 2.44,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900694",
    "nome": "BUCHA PAINEL INST/CX FUSIVEL FD CARGO/VW",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 1.78,
    "quantidade": 1,
    "total": 1.78,
    "categoria": "Elétrica"
  },
  {
    "id": "2500105",
    "nome": "SUPORTE HASTE CAPO",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 2.78,
    "quantidade": 1,
    "total": 2.78,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900259",
    "nome": "BUCHA VARETA CAPO ECOSPORT/FIESTA/FOC/KA",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 3.9,
    "quantidade": 1,
    "total": 3.9,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900398",
    "nome": "GRAMPO FOR. INT. ARGO/PALIO/DAFRA APACHE",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 0.76,
    "quantidade": 1,
    "total": 0.76,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900692",
    "nome": "PINO FORRO PEDAL PTO 709/1618/ATEGO/AXOR",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 1.43,
    "quantidade": 1,
    "total": 1.43,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900710",
    "nome": "BUCHA SUP GRADE/LUZ TETO MB ATEGO/ AXOR",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 2.76,
    "quantidade": 1,
    "total": 2.76,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900719",
    "nome": "BUCHA RED PAIN FRONT/INSTR MB AGL/BICUDO",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 0.61,
    "quantidade": 1,
    "total": 0.61,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900358",
    "nome": "GRAMPO DA CABINE FORD CARGO/TRANSIT TDS",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 4.91,
    "quantidade": 1,
    "total": 4.91,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900696",
    "nome": "GRAMPO GRADE CAMINHOES SCANIA SERIE 5/6",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 2.94,
    "quantidade": 1,
    "total": 2.94,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900711",
    "nome": "ARRASTE QUAD MAQ VIDRO SCANIA SERIE 4/5",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 14.34,
    "quantidade": 1,
    "total": 14.34,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900716",
    "nome": "ARRASTE TRILH MAQ VIDRO SCANIA SERIE 4/5",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 11.1,
    "quantidade": 1,
    "total": 11.1,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900683",
    "nome": "BUCHA MARROM COLUNA/TETO CONSTELL 07-12",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 3.7,
    "quantidade": 1,
    "total": 3.7,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900684",
    "nome": "GRAMPO REVEST TETO CONSTELLATION 06-20",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 4.19,
    "quantidade": 1,
    "total": 4.19,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900291",
    "nome": "PARAFUSO PARACHOQUE E PARALAMA AUDI/VW",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 1.43,
    "quantidade": 1,
    "total": 1.43,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900708",
    "nome": "GRAMPO GRADE FRONTAL/ESTRIBO FH-FM 15-20",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 3.62,
    "quantidade": 1,
    "total": 3.62,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900715",
    "nome": "GRAMPO FORRO PORTA VOLVO FH 07-20/FM 99",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 3.93,
    "quantidade": 1,
    "total": 3.93,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "500900717",
    "nome": "GRAMPO MOLD EXT RETROV VOLVO VM/VM17/23",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 3.52,
    "quantidade": 1,
    "total": 3.52,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "1500104",
    "nome": "GRAMPO REVESTIMENTO LATERAL/PORTA",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 0.34,
    "quantidade": 1,
    "total": 0.34,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "617000300",
    "nome": "BROCA HSS AUTOCENTRANTE DIN338 3,0MM",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 2.39,
    "quantidade": 1,
    "total": 2.39,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "617000350",
    "nome": "BROCA HSS AUTOCENTRANTE DIN338 3,5MM",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 3.39,
    "quantidade": 1,
    "total": 3.39,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "617000400",
    "nome": "BROCA HSS AUTOCENTRANTE DIN338 4,0MM",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 3.89,
    "quantidade": 1,
    "total": 3.89,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "617000450",
    "nome": "BROCA HSS AUTOCENTRANTE DIN338 4,5MM",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 4.99,
    "quantidade": 1,
    "total": 4.99,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "617000500",
    "nome": "BROCA HSS AUTOCENTRANTE DIN338 5,0MM",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 6.29,
    "quantidade": 1,
    "total": 6.29,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "617000550",
    "nome": "BROCA HSS AUTOCENTRANTE DIN338 5,5MM",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 8.19,
    "quantidade": 1,
    "total": 8.19,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "617000600",
    "nome": "BROCA HSS AUTOCENTRANTE DIN338 6,0MM",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 8.69,
    "quantidade": 1,
    "total": 8.69,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "617000650",
    "nome": "BROCA HSS AUTOCENTRANTE DIN338 6,5MM",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 9.89,
    "quantidade": 1,
    "total": 9.89,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "617000800",
    "nome": "BROCA HSS AUTOCENTRANTE DIN338 8,0MM",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 15.89,
    "quantidade": 1,
    "total": 15.89,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "675555024",
    "nome": "DISCO DE FIBRA P/ ACO 115MM G24",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 3.54,
    "quantidade": 25,
    "total": 88.5,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "675555036",
    "nome": "DISCO DE FIBRA P/ ACO 115MM G36",
    "fornecedor": "WURTH DO BRASIL",
    "preco": 3.54,
    "quantidade": 25,
    "total": 88.5,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "5067",
    "nome": "TERMINAL OLHAL 3/16 FURO 5MM",
    "fornecedor": "BRUSFER FERRAGENS (2020)",
    "preco": 17.9,
    "quantidade": 1,
    "total": 17.9,
    "categoria": "Elétrica"
  },
  {
    "id": "5066",
    "nome": "TERMINAL MACHO ESPADA P/FIO(FR1112)",
    "fornecedor": "BRUSFER FERRAGENS (2020)",
    "preco": 25.7,
    "quantidade": 1,
    "total": 25.7,
    "categoria": "Elétrica"
  },
  {
    "id": "5070",
    "nome": "TERMINAL OLHAL 1/4 FURO 7,1MM",
    "fornecedor": "BRUSFER FERRAGENS (2020)",
    "preco": 33.67,
    "quantidade": 1,
    "total": 33.67,
    "categoria": "Elétrica"
  },
  {
    "id": "5071",
    "nome": "TERMINAL OLHAL 3/8 FURO 10MM",
    "fornecedor": "BRUSFER FERRAGENS (2020)",
    "preco": 45.85,
    "quantidade": 1,
    "total": 45.85,
    "categoria": "Elétrica"
  },
  {
    "id": "5077",
    "nome": "TERMINAL FEMEA C/TRAVA 6,3MM",
    "fornecedor": "BRUSFER FERRAGENS (2020)",
    "preco": 14.1,
    "quantidade": 1,
    "total": 14.1,
    "categoria": "Elétrica"
  },
  {
    "id": "7199",
    "nome": "LUVA TERMINAL FEMEA S/TRAVA 6,3MM",
    "fornecedor": "BRUSFER FERRAGENS (2020)",
    "preco": 5.45,
    "quantidade": 1,
    "total": 5.45,
    "categoria": "Elétrica"
  },
  {
    "id": "8064",
    "nome": "LUVA PLASTICA TERMINAL MACHO 6.3MM",
    "fornecedor": "BRUSFER FERRAGENS (2020)",
    "preco": 5.43,
    "quantidade": 1,
    "total": 5.43,
    "categoria": "Elétrica"
  },
  {
    "id": "15465",
    "nome": "LUVA DE HELANCA PRETA G CA-29014 DANNY",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 4.42,
    "quantidade": 30,
    "total": 132.6,
    "categoria": "EPI e Segurança"
  },
  {
    "id": "9995",
    "nome": "SOQUETE TORX MACHO T-27 TRAMONTINA-PRO",
    "fornecedor": "FEMATEL",
    "preco": 15.98,
    "quantidade": 1,
    "total": 15.98,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "7891645083014",
    "nome": "SOQUETE CHAVE TORX 1/2 X T-30 SATA",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 32.97,
    "quantidade": 1,
    "total": 32.97,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "34394",
    "nome": "SOQUETE TORX MACHO T-40 SATA",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 32.9,
    "quantidade": 1,
    "total": 32.9,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "28682",
    "nome": "SOQUETE CHAVE TORX1/2 X T45",
    "fornecedor": "BRUSFER FERRAGENS",
    "preco": 29.54,
    "quantidade": 1,
    "total": 29.54,
    "categoria": "Ferramentas e Abrasivos"
  },
  {
    "id": "83261",
    "nome": "PNEU PRETINHO 5L VONIXX 02070237",
    "fornecedor": "SMB TINTAS",
    "preco": 55.0,
    "quantidade": 1,
    "total": 55.0,
    "categoria": "Limpeza e Lubrificantes"
  },
  {
    "id": "28829",
    "nome": "DESENGRAXANTE GEL HPLUS PLATINUM 3 KG",
    "fornecedor": "WALENDOWSKY FERRAGENS",
    "preco": 62.9,
    "quantidade": 1,
    "total": 62.9,
    "categoria": "Limpeza e Lubrificantes"
  },
  {
    "id": "37150",
    "nome": "61450 R2 AGUA DESMINERALIZADA BATERIAS (16UN CX)",
    "fornecedor": "DISAUTO",
    "preco": 2.9,
    "quantidade": 200,
    "total": 580.0,
    "categoria": "Fluidos Automotivos"
  },
  {
    "id": "VO992303",
    "nome": "Ferramenta De Sacar Mangueira Pneumática Volvo Fh 6mm",
    "fornecedor": "DICAVE ITAJAÍ",
    "preco": 19.77,
    "quantidade": 1,
    "total": 19.77,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "VO992302",
    "nome": "Ferramenta De Sacar Mangueira Pneumática Volvo Fh 8mm",
    "fornecedor": "DICAVE ITAJAÍ",
    "preco": 19.77,
    "quantidade": 1,
    "total": 19.77,
    "categoria": "Pneumática e Conexões"
  },
  {
    "id": "1400",
    "nome": "REBITE REPUXE 525",
    "fornecedor": "—",
    "preco": 0.0,
    "quantidade": 1,
    "total": 0.0,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "***",
    "nome": "PORCA SEXTAVADA 6MM LISA (100UN)",
    "fornecedor": "FEMATEL",
    "preco": 5.96,
    "quantidade": 5,
    "total": 29.8,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "***",
    "nome": "PORCA SEXTAVADA 8MM LISA (100UN)",
    "fornecedor": "FEMATEL",
    "preco": 12.05,
    "quantidade": 1,
    "total": 12.05,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "112",
    "nome": "PF SX RI 10X30 MA ZB",
    "fornecedor": "FEMATEL",
    "preco": 59.93,
    "quantidade": 1,
    "total": 59.93,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "202",
    "nome": "PO SX NY 6MM BXA MA ZB",
    "fornecedor": "FEMATEL",
    "preco": 6.9,
    "quantidade": 1,
    "total": 6.9,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "203",
    "nome": "PO SX NY 8MM BXA MA ZB",
    "fornecedor": "FEMATEL",
    "preco": 13.69,
    "quantidade": 1,
    "total": 13.69,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "2525",
    "nome": "AR LI 3/16 ZB (14X5,2X1,2)",
    "fornecedor": "FEMATEL",
    "preco": 5.63,
    "quantidade": 1,
    "total": 5.63,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "2527",
    "nome": "AR LI 1/2 ZB (30X13,5X2)",
    "fornecedor": "FEMATEL",
    "preco": 26.12,
    "quantidade": 1,
    "total": 26.12,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "6132",
    "nome": "PO SX 5MM MA ZB",
    "fornecedor": "FEMATEL",
    "preco": 5.02,
    "quantidade": 1,
    "total": 5.02,
    "categoria": "Fixação e Clips"
  },
  {
    "id": "7596",
    "nome": "PF SX RI 5X40 MA ZB",
    "fornecedor": "FEMATEL",
    "preco": 15.7,
    "quantidade": 1,
    "total": 15.7,
    "categoria": "Fixação e Clips"
  }
];

const slug = (v:string) => v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const seedNow = new Date().toISOString();

export const SEED_CATEGORIES: Category[] = [...new Set(RAW_PRODUCTS.map((p:any)=>String(p.categoria||'Outros'))) ]
  .sort((a,b)=>a.localeCompare(b,'pt-BR'))
  .map(name=>({id:'cat-'+slug(name),name,icon:CATEGORY_META[name]?.icon ?? 'Lista',tone:CATEGORY_META[name]?.tone ?? 'slate'}));

const supplierByName = new Map<string,Supplier>();
for (const raw of RAW_PRODUCTS) {
  const name = String(raw.fornecedor || '—').trim();
  if (!name || name === '?' || name === '—') continue;
  const id = 'sup-' + slug(name);
  if (!supplierByName.has(name)) supplierByName.set(name,{id,name,active:true,createdAt:seedNow,updatedAt:seedNow});
}
export const SEED_SUPPLIERS: Supplier[] = [...supplierByName.values()];

export const SEED_PRODUCTS: Product[] = RAW_PRODUCTS.map((raw:any,index:number)=>{
  const name = String(raw.nome||'').trim().toUpperCase();
  const code = String(raw.id ?? '—').trim() || '—';
  const categoryName = String(raw.categoria || 'Outros');
  const supplierName = String(raw.fornecedor || '—').trim();
  const supplier = supplierByName.get(supplierName);
  const stock = Math.max(0, Number(raw.quantidade)||0);
  const cost = Math.max(0, Number(raw.preco)||0);
  return {
    id:`p-seed-${String(index+1).padStart(4,'0')}`,
    code, name, supplierId:supplier?.id, supplierNameLegacy:supplierName,
    categoryId:'cat-'+slug(categoryName), unit:String(raw.unidade||'un'),
    currentStock:stock, minimumStock:2, reservedStock:0, currentCost:cost, averageCost:cost,
    active:true, createdAt:seedNow, updatedAt:seedNow, legacySource:'v8-seed'
  };
});
