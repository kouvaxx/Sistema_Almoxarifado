"use strict";
const CATEGORY_META = {
    'Iluminação': { icon: 'Lâmpada', tone: 'amber' },
    'Elétrica': { icon: 'Raio', tone: 'emerald' },
    'Pneumática e Conexões': { icon: 'Conector', tone: 'blue' },
    'Fixação e Clips': { icon: 'Parafuso', tone: 'violet' },
    'Ferramentas e Abrasivos': { icon: 'Ferramenta', tone: 'rose' },
    'Tintas, Resinas e Pintura': { icon: 'Pintura', tone: 'pink' },
    'Adesivos e Vedantes': { icon: 'Caixa', tone: 'teal' },
    'Limpeza e Lubrificantes': { icon: 'Gota', tone: 'cyan' },
    'Fluidos Automotivos': { icon: 'Barril', tone: 'orange' },
    'Soldagem e Maçarico': { icon: 'Fogo', tone: 'red' },
    'EPI e Segurança': { icon: 'Capacete', tone: 'lime' },
    'Outros': { icon: 'Lista', tone: 'slate' }
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
const slug = (v) => v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const seedNow = new Date().toISOString();
const SEED_CATEGORIES = [...new Set(RAW_PRODUCTS.map((p) => String(p.categoria || 'Outros')))]
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))
    .map(name => ({ id: 'cat-' + slug(name), name, icon: CATEGORY_META[name]?.icon ?? 'Lista', tone: CATEGORY_META[name]?.tone ?? 'slate' }));
const supplierByName = new Map();
for (const raw of RAW_PRODUCTS) {
    const name = String(raw.fornecedor || '—').trim();
    if (!name || name === '?' || name === '—')
        continue;
    const id = 'sup-' + slug(name);
    if (!supplierByName.has(name))
        supplierByName.set(name, { id, name, active: true, createdAt: seedNow, updatedAt: seedNow });
}
const SEED_SUPPLIERS = [...supplierByName.values()];
const SEED_PRODUCTS = RAW_PRODUCTS.map((raw, index) => {
    const name = String(raw.nome || '').trim().toUpperCase();
    const code = String(raw.id ?? '—').trim() || '—';
    const categoryName = String(raw.categoria || 'Outros');
    const supplierName = String(raw.fornecedor || '—').trim();
    const supplier = supplierByName.get(supplierName);
    const stock = Math.max(0, Number(raw.quantidade) || 0);
    const cost = Math.max(0, Number(raw.preco) || 0);
    return {
        id: `p-seed-${String(index + 1).padStart(4, '0')}`,
        code, name, supplierId: supplier?.id, supplierNameLegacy: supplierName,
        categoryId: 'cat-' + slug(categoryName), unit: String(raw.unidade || 'un'),
        currentStock: stock, minimumStock: 2, reservedStock: 0, currentCost: cost, averageCost: cost,
        active: true, createdAt: seedNow, updatedAt: seedNow, legacySource: 'v8-seed'
    };
});
const DB_NAME = 'almoxarifado_v9';
const DB_VERSION = 1;
const STORES = ['products', 'suppliers', 'categories', 'movements', 'nfe', 'nfeItems', 'quotes', 'audit', 'config'];
class LocalDB {
    db;
    async open() {
        if (this.db)
            return;
        this.db = await new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onerror = () => reject(req.error ?? new Error('Não foi possível abrir o banco local.'));
            req.onupgradeneeded = () => {
                const db = req.result;
                for (const store of STORES) {
                    if (!db.objectStoreNames.contains(store)) {
                        db.createObjectStore(store, { keyPath: 'id' });
                    }
                }
            };
            req.onsuccess = () => resolve(req.result);
        });
    }
    async ready() { await this.open(); if (!this.db)
        throw new Error('Banco não inicializado.'); return this.db; }
    async getAll(store) {
        const db = await this.ready();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(store, 'readonly');
            const req = tx.objectStore(store).getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    async get(store, id) {
        const db = await this.ready();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(store, 'readonly');
            const req = tx.objectStore(store).get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    async put(store, value) {
        const db = await this.ready();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(store, 'readwrite');
            tx.objectStore(store).put(value);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error ?? new Error('Transação abortada.'));
        });
    }
    async bulkPut(store, values) {
        if (!values.length)
            return;
        const db = await this.ready();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(store, 'readwrite');
            const os = tx.objectStore(store);
            for (const value of values)
                os.put(value);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error ?? new Error('Transação abortada.'));
        });
    }
    async delete(store, id) {
        const db = await this.ready();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(store, 'readwrite');
            tx.objectStore(store).delete(id);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error ?? new Error('Transação abortada.'));
        });
    }
    async clear(store) {
        const db = await this.ready();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(store, 'readwrite');
            tx.objectStore(store).clear();
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error ?? new Error('Transação abortada.'));
        });
    }
}
const db = new LocalDB();
async function loadSnapshot() {
    const [products, suppliers, categories, movements, nfe, nfeItems, quotes, audit, configs] = await Promise.all([
        db.getAll('products'), db.getAll('suppliers'), db.getAll('categories'),
        db.getAll('movements'), db.getAll('nfe'), db.getAll('nfeItems'),
        db.getAll('quotes'), db.getAll('audit'), db.getAll('config')
    ]);
    return {
        products, suppliers, categories, movements, nfe, nfeItems, quotes, audit,
        config: configs[0] ?? defaultConfig()
    };
}
async function replaceSnapshot(snapshot) {
    const sets = [
        ['products', snapshot.products], ['suppliers', snapshot.suppliers], ['categories', snapshot.categories],
        ['movements', snapshot.movements], ['nfe', snapshot.nfe], ['nfeItems', snapshot.nfeItems],
        ['quotes', snapshot.quotes], ['audit', snapshot.audit], ['config', [snapshot.config]]
    ];
    for (const [store, values] of sets) {
        await db.clear(store);
        await db.bulkPut(store, values);
    }
}
function defaultConfig() {
    return {
        id: 'main',
        theme: 'dark',
        allowNegativeStock: false,
        defaultMinimumStock: 2,
        backupRetention: 20,
        initializedAt: new Date().toISOString(),
        schemaVersion: 1
    };
}
const APP = 'Almoxarifado v9';
const uid = (prefix = 'id') => `${prefix}-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
const now = () => new Date().toISOString();
const money = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number.isFinite(n) ? n : 0);
const qty = (n) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 }).format(Number.isFinite(n) ? n : 0);
const dateTime = (s) => s ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(s)) : '—';
const dateOnly = (s) => s ? new Intl.DateTimeFormat('pt-BR').format(new Date(s)) : '—';
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (v) => v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const NAV = [
    { id: 'dashboard', label: 'Visão geral', section: 'INÍCIO', icon: 'dashboard' },
    { id: 'products', label: 'Produtos', section: 'CADASTRO', icon: 'box' },
    { id: 'suppliers', label: 'Fornecedores', section: 'CADASTRO', icon: 'building' },
    { id: 'stock', label: 'Estoque', section: 'ESTOQUE', icon: 'layers' },
    { id: 'inventory', label: 'Inventário', section: 'ESTOQUE', icon: 'clipboard' },
    { id: 'nfe', label: 'NF-e', section: 'COMPRAS', icon: 'file' },
    { id: 'quotes', label: 'Orçamentos', section: 'COMERCIAL', icon: 'receipt' },
    { id: 'audit', label: 'Auditoria', section: 'GESTÃO', icon: 'shield' },
    { id: 'settings', label: 'Configurações', section: 'SISTEMA', icon: 'settings' }
];
const ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    box: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    building: '<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    clipboard: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3h6v3H9z"/><path d="M8 10h8M8 14h8M8 18h5"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    receipt: '<path d="M4 3h16v18l-3-2-3 2-4-2-3 2-3-2Z"/><path d="M8 8h8M8 12h8M8 16h4"/>',
    shield: '<path d="M12 3 20 6v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
    settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.5 1.5-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20H12v-.4a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.5-1.5.06-.06A1.7 1.7 0 0 0 7.6 15a1.7 1.7 0 0 0-1.56-1.03H5V12h1.04A1.7 1.7 0 0 0 7.6 11a1.7 1.7 0 0 0-.34-1.88L7.2 9.06l1.5-1.5.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.67 6V5H14v1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.5 1.5-.06.06A1.7 1.7 0 0 0 18.06 11 1.7 1.7 0 0 0 19.6 12H21v2h-1.04A1.7 1.7 0 0 0 19.4 15Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    filter: '<path d="M4 5h16M7 12h10M10 19h4"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/>',
    upload: '<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M4 3h16"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    edit: '<path d="m4 17 9-9 4 4-9 9H4v-4Z"/><path d="m14 7 2-2 4 4-2 2"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7l1-3h4l1 3"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14-4L3 10"/><path d="M3 5v5h5M4 13a8 8 0 0 0 14 4l3-3"/><path d="M21 19v-5h-5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    alert: '<path d="M12 3 21 19H3L12 3Z"/><path d="M12 9v4M12 16h.01"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5M12 7v5l3 2"/>',
    moon: '<path d="M20 14.6A8.5 8.5 0 0 1 9.4 4 8.5 8.5 0 1 0 20 14.6Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
    print: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/>',
    filePlus: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M12 12v6M9 15h6"/>',
    barcode: '<path d="M4 5v14M7 5v14M10 5v14M14 5v14M17 5v14M20 5v14"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
    zap: '<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/>',
    truck: '<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
    wallet: '<path d="M4 6h16v12H4z"/><path d="M4 6V4h14"/><path d="M16 12h4"/>',
    chart: '<path d="M4 19V9M10 19V5M16 19v-8M22 19V3"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M14 9l2 2"/>'
};
const icon = (name, size = 18) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ICONS.box}</svg>`;
let state = { products: [], suppliers: [], categories: [], movements: [], nfe: [], nfeItems: [], quotes: [], audit: [], config: defaultConfig(), view: 'dashboard', query: '', categoryId: '', supplierId: '', stockStatus: '', sort: 'name', mobileNav: false, theme: 'dark' };
function getProduct(id) { return state.products.find(p => p.id === id); }
function getSupplier(id) { return state.suppliers.find(s => s.id === id); }
function getCategory(id) { return state.categories.find(c => c.id === id); }
function statusFor(p) {
    if (p.currentStock <= 0)
        return 'critical';
    if (p.minimumStock > 0 && p.currentStock <= p.minimumStock)
        return 'low';
    if (p.maximumStock && p.currentStock > p.maximumStock)
        return 'over';
    return 'ok';
}
function statusLabel(s) { return s === 'critical' ? 'Zerado' : s === 'low' ? 'Comprar' : s === 'over' ? 'Excedente' : 'Normal'; }
function statusClass(s) { return `status-${s}`; }
function log(type, message, detail, entityType, entityId) {
    const item = { id: uid('audit'), type, message, detail, entityType, entityId, createdAt: now() };
    state.audit.unshift(item);
    state.audit = state.audit.slice(0, 3000);
    db.put('audit', item).catch(() => { });
}
function toast(message, type = 'success') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${type === 'success' ? icon('check', 16) : type === 'warning' ? icon('alert', 16) : icon('alert', 16)}</span>${esc(message)}`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => el.classList.remove('show'), 2500);
    setTimeout(() => el.remove(), 3000);
}
async function seedDatabase() {
    const snapshot = await loadSnapshot();
    if (snapshot.products.length)
        return snapshot;
    const categories = SEED_CATEGORIES;
    const suppliers = SEED_SUPPLIERS;
    const products = SEED_PRODUCTS;
    const movements = [];
    const quotes = [];
    const nfe = [];
    const nfeItems = [];
    const audit = [];
    const config = defaultConfig();
    config.schemaVersion = 1;
    await db.bulkPut('categories', categories);
    await db.bulkPut('suppliers', suppliers);
    await db.bulkPut('products', products);
    await db.bulkPut('movements', movements);
    await db.bulkPut('quotes', quotes);
    await db.bulkPut('audit', audit);
    await db.bulkPut('nfe', nfe);
    await db.bulkPut('nfeItems', []);
    await db.put('config', config);
    return { products, suppliers, categories, movements, nfe, nfeItems, quotes, audit, config };
}
async function tryLegacyMigration() {
    try {
        const legacy = localStorage.getItem('produtos_lista_v8');
        if (!legacy)
            return false;
        const existing = await db.getAll('products');
        if (existing.length)
            return false;
        const arr = JSON.parse(legacy);
        if (!Array.isArray(arr) || !arr.length)
            return false;
        const suppliersByName = new Map();
        const categoriesByName = new Map();
        const products = [];
        const t = now();
        for (const [i, p] of arr.entries()) {
            const supplierName = String(p.fornecedor || '—').trim();
            let supplierId;
            if (supplierName && supplierName !== '?' && supplierName !== '—') {
                supplierId = 'sup-' + norm(supplierName).replace(/[^a-z0-9]+/g, '-');
                if (!suppliersByName.has(supplierName))
                    suppliersByName.set(supplierName, { id: supplierId, name: supplierName, active: true, createdAt: t, updatedAt: t });
            }
            const catName = String(p.categoria || 'Outros');
            const catId = 'cat-' + norm(catName).replace(/[^a-z0-9]+/g, '-');
            if (!categoriesByName.has(catName))
                categoriesByName.set(catName, { id: catId, name: catName, icon: CATEGORY_META[catName]?.icon ?? 'Lista', tone: CATEGORY_META[catName]?.tone ?? 'slate' });
            const stock = Math.max(0, Number(p.estoqueAtual ?? p.quantidade) || 0);
            const cost = Math.max(0, Number(p.preco) || 0);
            products.push({ id: uid('p'), code: String(p.id ?? '—'), name: String(p.nome || '').trim().toUpperCase(), supplierId, supplierNameLegacy: supplierName, categoryId: catId, unit: p.unidade || 'un', currentStock: stock, minimumStock: 2, reservedStock: 0, currentCost: cost, averageCost: cost, active: true, createdAt: t, updatedAt: t, legacySource: 'v8-import' });
        }
        await db.bulkPut('suppliers', [...suppliersByName.values()]);
        await db.bulkPut('categories', [...categoriesByName.values()]);
        await db.bulkPut('products', products);
        const config = defaultConfig();
        await db.put('config', config);
        log('import', `Migração da v8 concluída: ${products.length} produtos`, 'Origem: localStorage produtos_lista_v8');
        return true;
    }
    catch {
        return false;
    }
}
function filteredProducts() {
    let arr = state.products.filter(p => p.active);
    const q = norm(state.query);
    if (q)
        arr = arr.filter(p => norm(`${p.name} ${p.code} ${p.supplierNameLegacy ?? getSupplier(p.supplierId)?.name ?? ''} ${getCategory(p.categoryId)?.name ?? ''}`).includes(q));
    if (state.categoryId)
        arr = arr.filter(p => p.categoryId === state.categoryId);
    if (state.supplierId)
        arr = arr.filter(p => p.supplierId === state.supplierId);
    if (state.stockStatus)
        arr = arr.filter(p => statusFor(p) === state.stockStatus);
    arr = [...arr];
    switch (state.sort) {
        case 'name':
            arr.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
            break;
        case 'stock':
            arr.sort((a, b) => b.currentStock - a.currentStock);
            break;
        case 'cost':
            arr.sort((a, b) => b.currentCost - a.currentCost);
            break;
        case 'value':
            arr.sort((a, b) => (b.currentStock * b.currentCost) - (a.currentStock * a.currentCost));
            break;
        case 'low':
            arr.sort((a, b) => ({ critical: 0, low: 1, over: 2, ok: 3 }[statusFor(a)] - ({ critical: 0, low: 1, over: 2, ok: 3 }[statusFor(b)])));
            break;
    }
    return arr;
}
function kpis() {
    const products = state.products.filter(p => p.active);
    const value = products.reduce((s, p) => s + p.currentStock * p.currentCost, 0);
    const low = products.filter(p => ['low', 'critical'].includes(statusFor(p))).length;
    const zero = products.filter(p => p.currentStock <= 0).length;
    const month = state.movements.filter(m => new Date(m.createdAt).getMonth() === new Date().getMonth() && m.type === 'entrada').length;
    return { products: products.length, value, low, zero, month, movements: state.movements.length };
}
function shell() {
    const navSections = [...new Set(NAV.map(x => x.section))];
    const grouped = navSections.map(section => `<div class="nav-section"><div class="nav-label">${section}</div>${NAV.filter(x => x.section === section).map(n => `<button class="nav-item ${state.view === n.id ? 'active' : ''}" data-view="${n.id}">${icon(n.icon, 17)}<span>${n.label}</span>${n.id === 'nfe' && state.nfe.filter(n => n.status === 'new' || n.status === 'review').length ? `<b class="nav-badge">${state.nfe.filter(n => n.status === 'new' || n.status === 'review').length}</b>` : ''}</button>`).join('')}</div>`).join('');
    const themeIcon = state.theme === 'dark' ? icon('moon', 15) : icon('sun', 15);
    return `<div class="app-shell ${state.theme === 'light' ? 'theme-light' : ''}">
    <aside class="sidebar ${state.mobileNav ? 'open' : ''}">
      <div class="brand"><div class="brand-mark">${icon('box', 19)}</div><div><strong>Almoxarifado</strong><span>Lista de Produtos • v9</span></div></div>
      <div class="sidebar-scroll">${grouped}</div>
      <div class="sidebar-foot"><button class="user-chip" data-action="settings"><span class="avatar">JB</span><span><b>Operação</b><small>Offline-first</small></span>${icon('settings', 15)}</button></div>
    </aside>
    <div class="main-shell">
      <header class="topbar">
        <button class="icon-btn mobile-menu" data-action="toggle-nav">${icon('menu', 20)}</button>
        <button class="global-search" data-action="command"><span class="search-symbol">${icon('search', 17)}</span><span>Pesquisar produto, fornecedor, NF-e...</span><kbd>Ctrl K</kbd></button>
        <div class="top-actions"><span class="save-status"><i></i> Banco local</span><button class="icon-btn" data-action="theme" title="Alternar tema">${themeIcon}</button><button class="btn btn-primary" data-action="new-product">${icon('plus', 16)} Novo produto</button></div>
      </header>
      <main class="page">${renderView()}</main>
    </div>
    <div id="modal-root"></div><div id="drawer-root"></div><div id="toast-root"></div>
  </div>`;
}
function renderView() {
    switch (state.view) {
        case 'dashboard': return renderDashboard();
        case 'products': return renderProducts();
        case 'suppliers': return renderSuppliers();
        case 'stock': return renderStock();
        case 'inventory': return renderInventory();
        case 'nfe': return renderNfe();
        case 'quotes': return renderQuotes();
        case 'audit': return renderAudit();
        case 'settings': return renderSettings();
    }
}
function pageHead(title, sub, actions = '') { return `<div class="page-head"><div><div class="eyebrow">ALMOXARIFADO</div><h1>${title}</h1><p>${sub}</p></div><div class="page-head-actions">${actions}</div></div>`; }
function actionBtn(label, action, iconName = 'plus', primary = false) { return `<button class="btn ${primary ? 'btn-primary' : ''}" data-action="${action}">${icon(iconName, 15)} ${label}</button>`; }
function renderDashboard() {
    const k = kpis();
    const critical = filteredCritical(6);
    const recent = state.movements.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 7);
    const pending = state.nfe.filter(n => n.status === 'new' || n.status === 'review');
    return pageHead('Visão geral', 'O que precisa da sua atenção hoje?', actionBtn('Nova movimentação', 'new-movement', 'plus', true)) + `<section class="kpi-grid">
      ${kpi('Valor em estoque', money(k.value), 'wallet', '', true)}
      ${kpi('Produtos ativos', String(k.products), 'box', '')}
      ${kpi('Estoque crítico', String(k.low), 'alert', k.low ? 'danger' : 'good')}
      ${kpi('Entradas no mês', String(k.month), 'truck', '')}
    </section>
    <section class="dashboard-grid">
      <div class="panel span-2"><div class="panel-head"><div><h2>Estoque crítico</h2><p>Itens zerados ou abaixo do mínimo.</p></div>${actionBtn('Ver estoque', 'stock', 'arrow')}</div>${critical.length ? `<div class="table-wrap compact"><table><thead><tr><th>Produto</th><th>Estoque</th><th>Mínimo</th><th>Status</th><th></th></tr></thead><tbody>${critical.map(p => productRow(p)).join('')}</tbody></table></div>` : `<div class="empty-state mini"><div class="empty-icon success">${icon('check', 28)}</div><b>Nenhum item crítico</b><span>O estoque está dentro dos parâmetros cadastrados.</span></div>`}</div>
      <div class="panel"><div class="panel-head"><div><h2>Atenção</h2><p>Filas de operação.</p></div></div><div class="attention-list">
        <button class="attention-item" data-view="nfe"><span class="attention-icon amber">${icon('file', 17)}</span><span><b>${pending.length} NF-e</b><small>Aguardando conferência</small></span>${icon('arrow', 15)}</button>
        <button class="attention-item" data-view="inventory"><span class="attention-icon blue">${icon('clipboard', 17)}</span><span><b>${k.zero} zerados</b><small>Precisam de reposição</small></span>${icon('arrow', 15)}</button>
        <button class="attention-item" data-view="suppliers"><span class="attention-icon violet">${icon('building', 17)}</span><span><b>${state.suppliers.filter(s => s.active).length} fornecedores</b><small>Base cadastrada</small></span>${icon('arrow', 15)}</button>
      </div></div>
      <div class="panel"><div class="panel-head"><div><h2>Últimas movimentações</h2><p>Registro operacional recente.</p></div>${actionBtn('Abrir', 'stock', 'arrow')}</div><div class="timeline">${recent.length ? recent.map(m => movementItem(m)).join('') : `<div class="empty-state mini"><span>Nenhuma movimentação registrada.</span></div>`}</div></div>
      <div class="panel span-2"><div class="panel-head"><div><h2>Resumo por categoria</h2><p>Valor e quantidade no estoque atual.</p></div></div><div class="category-grid">${summaryCategories().map(x => `<button class="category-card" data-category="${x.id}"><span class="cat-dot tone-${x.tone}">${icon('box', 16)}</span><span><b>${esc(x.name)}</b><small>${qty(x.stock)} ${x.stock === 1 ? 'unidade' : 'unidades'}</small></span><strong>${money(x.value)}</strong></button>`).join('')}</div></div>
    </section>`;
}
function kpi(label, value, iconName, tone, featured = false) { return `<div class="kpi ${featured ? 'featured' : ''}"><div class="kpi-icon ${tone}">${icon(iconName, 18)}</div><div><span>${label}</span><strong>${value}</strong></div></div>`; }
function filteredCritical(limit) { return state.products.filter(p => p.active && ['low', 'critical'].includes(statusFor(p))).sort((a, b) => a.currentStock - b.currentStock).slice(0, limit); }
function productRow(p) { const cat = getCategory(p.categoryId); const s = statusFor(p); return `<tr><td><button class="link-button" data-product="${p.id}"><b>${esc(p.name)}</b><small>${esc(p.code)} · ${esc(cat?.name || 'Outros')}</small></button></td><td><strong>${qty(p.currentStock)}</strong> ${esc(p.unit)}</td><td>${qty(p.minimumStock)}</td><td><span class="status ${statusClass(s)}"><i></i>${statusLabel(s)}</span></td><td><button class="icon-btn" data-product="${p.id}">${icon('arrow', 15)}</button></td></tr>`; }
function movementItem(m) { return `<div class="timeline-item"><span class="move-icon ${m.type === 'entrada' || m.type === 'devolucao' ? 'positive' : 'negative'}">${icon(m.type === 'entrada' || m.type === 'devolucao' ? 'download' : 'upload', 15)}</span><div><b>${esc(m.productName)}</b><small>${m.type.toUpperCase()} · ${dateTime(m.createdAt)}${m.document ? ' · ' + esc(m.document) : ''}</small></div><strong class="${m.type === 'entrada' || m.type === 'devolucao' ? 'positive-text' : 'negative-text'}">${m.type === 'saida' ? '−' : '+'}${qty(m.quantity)}</strong></div>`; }
function summaryCategories() { const map = new Map(); for (const p of state.products) {
    const c = getCategory(p.categoryId);
    const x = map.get(p.categoryId) ?? { id: p.categoryId, name: c?.name || 'Outros', tone: c?.tone || 'slate', stock: 0, value: 0 };
    x.stock += p.currentStock;
    x.value += p.currentStock * p.currentCost;
    map.set(p.categoryId, x);
} return [...map.values()].sort((a, b) => b.value - a.value).slice(0, 8); }
function renderProducts() {
    const products = filteredProducts();
    const actions = actionBtn('Importar backup', 'import-backup', 'upload') + actionBtn('Exportar JSON', 'export-json', 'download') + actionBtn('Novo produto', 'new-product', 'plus', true);
    return pageHead('Produtos', 'Cadastro central de materiais, peças e consumíveis.', actions) + `<div class="toolbar panel"><div class="search-box"><span>${icon('search', 17)}</span><input id="query" value="${esc(state.query)}" placeholder="Buscar nome, código, fornecedor..." /></div><select id="cat-filter"><option value="">Todas as categorias</option>${state.categories.map(c => `<option value="${c.id}" ${state.categoryId === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select><select id="supplier-filter"><option value="">Todos os fornecedores</option>${state.suppliers.filter(s => s.active).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).map(s => `<option value="${s.id}" ${state.supplierId === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select><select id="stock-filter"><option value="">Todos os estoques</option><option value="critical" ${state.stockStatus === 'critical' ? 'selected' : ''}>Zerado</option><option value="low" ${state.stockStatus === 'low' ? 'selected' : ''}>Baixo</option><option value="ok" ${state.stockStatus === 'ok' ? 'selected' : ''}>Normal</option><option value="over" ${state.stockStatus === 'over' ? 'selected' : ''}>Excedente</option></select><select id="sort-filter"><option value="name">Nome</option><option value="stock" ${state.sort === 'stock' ? 'selected' : ''}>Maior estoque</option><option value="cost" ${state.sort === 'cost' ? 'selected' : ''}>Maior custo</option><option value="value" ${state.sort === 'value' ? 'selected' : ''}>Maior valor</option><option value="low" ${state.sort === 'low' ? 'selected' : ''}>Maior urgência</option></select><button class="icon-btn" data-action="clear-filters" title="Limpar filtros">${icon('refresh', 17)}</button></div>
  <div class="table-panel panel"><div class="table-meta"><span><b>${products.length}</b> produtos exibidos</span><span>Valor filtrado <b>${money(products.reduce((s, p) => s + p.currentStock * p.currentCost, 0))}</b></span></div><div class="table-wrap"><table><thead><tr><th>Produto</th><th>Fornecedor</th><th>Estoque</th><th>Mín.</th><th>Custo atual</th><th>Valor estoque</th><th>Status</th><th></th></tr></thead><tbody>${products.map(p => productTableRow(p)).join('')}</tbody></table></div>${!products.length ? empty('Nenhum produto encontrado', 'Ajuste os filtros ou cadastre um novo item.', 'box') : ''}</div>`;
}
function productTableRow(p) { const s = statusFor(p), sup = getSupplier(p.supplierId)?.name || p.supplierNameLegacy || '—', cat = getCategory(p.categoryId)?.name || 'Outros'; return `<tr><td><button class="link-button" data-product="${p.id}"><b>${esc(p.name)}</b><small>${esc(p.code)} · ${esc(cat)}</small></button></td><td>${esc(sup)}</td><td><strong>${qty(p.currentStock)}</strong> <small>${esc(p.unit)}</small></td><td>${qty(p.minimumStock)}</td><td>${money(p.currentCost)}</td><td><b>${money(p.currentStock * p.currentCost)}</b></td><td><span class="status ${statusClass(s)}"><i></i>${statusLabel(s)}</span></td><td><button class="icon-btn" data-product="${p.id}">${icon('more', 17)}</button></td></tr>`; }
function renderSuppliers() {
    const rows = state.suppliers.filter(s => s.active).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).map(s => { const ps = state.products.filter(p => p.supplierId === s.id); const total = ps.reduce((x, p) => x + p.currentStock * p.currentCost, 0); const last = state.movements.filter(m => m.type === 'entrada' && ps.some(p => p.id === m.productId)).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0]; return `<tr><td><button class="link-button" data-supplier="${s.id}"><b>${esc(s.name)}</b><small>${esc(s.cnpj || 'CNPJ não informado')}</small></button></td><td>${ps.length}</td><td>${money(total)}</td><td>${last ? dateOnly(last.createdAt) : '—'}</td><td><span class="status status-ok"><i></i>Ativo</span></td><td><button class="icon-btn" data-supplier="${s.id}">${icon('arrow', 15)}</button></td></tr>`; }).join('');
    return pageHead('Fornecedores', 'Cadastro independente com histórico de compras e produtos.', actionBtn('Novo fornecedor', 'new-supplier', 'plus', true)) + `<div class="supplier-grid">${state.suppliers.filter(s => s.active).slice(0, 6).map(s => `<button class="supplier-card" data-supplier="${s.id}"><span class="supplier-avatar">${esc(s.name.slice(0, 2))}</span><span><b>${esc(s.name)}</b><small>${state.products.filter(p => p.supplierId === s.id).length} produtos</small></span>${icon('arrow', 15)}</button>`).join('')}</div><div class="panel table-panel"><div class="table-meta"><span>${state.suppliers.filter(s => s.active).length} fornecedores ativos</span><span>Histórico de custo disponível por produto</span></div><div class="table-wrap"><table><thead><tr><th>Fornecedor</th><th>Produtos</th><th>Valor no estoque</th><th>Última entrada</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function renderStock() {
    const movements = state.movements.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return pageHead('Estoque', 'Movimente entradas, saídas e ajustes com rastreabilidade.', actionBtn('Registrar movimento', 'new-movement', 'plus', true)) + `<div class="stock-layout"><div class="panel"><div class="panel-head"><div><h2>Saldo atual</h2><p>Produtos e indicadores de reposição.</p></div></div><div class="stock-summary"><div><span>Valor</span><b>${money(kpis().value)}</b></div><div><span>Críticos</span><b class="danger-text">${kpis().low}</b></div><div><span>Reservado</span><b>${qty(state.products.reduce((s, p) => s + p.reservedStock, 0))}</b></div></div><div class="table-wrap"><table><thead><tr><th>Produto</th><th>Atual</th><th>Disponível</th><th>Custo</th><th>Status</th></tr></thead><tbody>${filteredProducts().slice(0, 20).map(p => `<tr><td><button class="link-button" data-product="${p.id}"><b>${esc(p.name)}</b><small>${esc(p.code)}</small></button></td><td>${qty(p.currentStock)} ${esc(p.unit)}</td><td>${qty(Math.max(0, p.currentStock - p.reservedStock))}</td><td>${money(p.currentCost)}</td><td><span class="status ${statusClass(statusFor(p))}"><i></i>${statusLabel(statusFor(p))}</span></td></tr>`).join('')}</tbody></table></div></div><div class="panel"><div class="panel-head"><div><h2>Movimentações</h2><p>Últimos 50 lançamentos.</p></div></div><div class="timeline tall">${movements.slice(0, 50).map(m => movementItem(m)).join('') || '<div class="empty-state mini"><span>Nenhuma movimentação.</span></div>'}</div></div></div>`;
}
function renderInventory() {
    const candidates = state.products.filter(p => p.active).slice().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    return pageHead('Inventário', 'Conferência física com ajuste rastreável.', actionBtn('Gerar ajuste', 'save-inventory', 'check', true)) + `<div class="panel inventory-panel"><div class="panel-head"><div><h2>Contagem física</h2><p>Informe a quantidade encontrada. O sistema só altera o estoque após a confirmação.</p></div><div class="inventory-count"><b id="inv-diff">0</b><span>itens com diferença</span></div></div><div class="inventory-table table-wrap"><table><thead><tr><th>Produto</th><th>Estoque sistema</th><th>Contagem física</th><th>Diferença</th><th></th></tr></thead><tbody>${candidates.map(p => `<tr><td><button class="link-button" data-product="${p.id}"><b>${esc(p.name)}</b><small>${esc(p.code)}</small></button></td><td>${qty(p.currentStock)}</td><td><input class="number-input inventory-input" data-product="${p.id}" type="number" min="0" step="0.001" placeholder="${p.currentStock}" /></td><td class="inventory-diff" data-diff="${p.id}">—</td><td>${icon('clipboard', 15)}</td></tr>`).join('')}</tbody></table></div></div>`;
}
function renderNfe() {
    const docs = state.nfe.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return pageHead('NF-e', 'Entrada de documentos, conferência e rastreabilidade.', actionBtn('Importar documento', 'import-nfe', 'upload', true)) + `<div class="nfe-drop panel" id="nfe-drop" data-action="nfe-drop"><div class="drop-icon">${icon('filePlus', 30)}</div><div><h2>Arraste uma NF-e aqui</h2><p>JSON/CSV podem ser processados imediatamente; PDFs entram na fila de conferência e ficam associados ao documento.</p></div><button class="btn btn-secondary" data-action="import-nfe">${icon('upload', 15)} Selecionar arquivo</button><input type="file" id="nfe-file" hidden accept=".pdf,.json,.csv,text/plain,application/json,text/csv" /></div><div class="panel table-panel"><div class="table-meta"><span><b>${docs.length}</b> documentos</span><span>${docs.filter(x => x.status !== 'processed').length} aguardando ação</span></div><div class="table-wrap"><table><thead><tr><th>Documento</th><th>Fornecedor</th><th>Data</th><th>Total</th><th>Origem</th><th>Status</th><th></th></tr></thead><tbody>${docs.map(n => `<tr><td><b>${esc(n.number || 'NF-e sem número')}</b><small>${esc(n.key || n.sourceName)}</small></td><td>${esc(n.supplierName || '—')}</td><td>${dateOnly(n.issueDate)}</td><td>${money(n.total || 0)}</td><td>${n.sourceType.toUpperCase()}</td><td><span class="status ${n.status === 'processed' ? 'status-ok' : n.status === 'error' ? 'status-critical' : 'status-low'}"><i></i>${n.status === 'processed' ? 'Processada' : n.status === 'review' ? 'Revisar' : n.status === 'error' ? 'Erro' : 'Nova'}</span></td><td><button class="icon-btn" data-nfe="${n.id}">${icon('arrow', 15)}</button></td></tr>`).join('') || `<tr><td colspan="7">Nenhuma NF-e importada.</td></tr>`}</tbody></table></div></div>`;
}
function renderQuotes() { const qs = state.quotes.slice().sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)); return pageHead('Orçamentos', 'Monte propostas a partir do catálogo e mantenha versões.', actionBtn('Novo orçamento', 'new-quote', 'plus', true)) + `<div class="quote-grid">${qs.slice(0, 4).map(q => `<button class="quote-card" data-quote="${q.id}"><div class="quote-status ${q.status}">${q.status}</div><b>${esc(q.number)} · ${esc(q.title || 'Sem título')}</b><span>${esc(q.customer || 'Cliente não informado')}</span><small>${q.items.length} itens · ${money(quoteTotal(q))}</small>${icon('arrow', 15)}</button>`).join('') || `<div class="empty-state mini"><div class="empty-icon">${icon('receipt', 26)}</div><b>Nenhum orçamento salvo</b><span>Crie um orçamento a partir do catálogo.</span></div>`}</div><div class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Número</th><th>Cliente</th><th>Status</th><th>Itens</th><th>Total</th><th>Atualizado</th></tr></thead><tbody>${qs.map(q => `<tr><td><button class="link-button" data-quote="${q.id}"><b>${esc(q.number)}</b><small>${esc(q.title)}</small></button></td><td>${esc(q.customer || '—')}</td><td><span class="quote-status ${q.status}">${q.status}</span></td><td>${q.items.length}</td><td>${money(quoteTotal(q))}</td><td>${dateTime(q.updatedAt)}</td></tr>`).join('') || '<tr><td colspan="6">Nenhum orçamento.</td></tr>'}</tbody></table></div></div>`; }
function quoteTotal(q) { return q.items.reduce((sum, i) => sum + i.quantity * i.unitPrice - (i.discount || 0), 0); }
function renderAudit() { const entries = state.audit.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); return pageHead('Auditoria', 'Histórico das alterações e operações relevantes.', actionBtn('Exportar JSON', 'export-json', 'download')) + `<div class="panel"><div class="audit-list">${entries.slice(0, 150).map(a => `<div class="audit-row"><span class="audit-icon ${a.type}">${icon(a.type === 'movement' ? 'layers' : a.type === 'delete' ? 'trash' : a.type === 'create' ? 'plus' : a.type === 'import' ? 'upload' : 'history', 15)}</span><div><b>${esc(a.message)}</b><small>${dateTime(a.createdAt)}${a.detail ? ' · ' + esc(a.detail) : ''}</small></div><span class="audit-type">${esc(a.type)}</span></div>`).join('') || `<div class="empty-state mini"><span>Nenhum registro.</span></div>`}</div></div>`; }
function renderSettings() { return pageHead('Configurações', 'Preferências operacionais e manutenção do banco local.') + `<div class="settings-grid"><div class="panel settings-card"><div class="panel-head"><div><h2>Estoque</h2><p>Regras de movimentação.</p></div></div><label class="setting-row"><span><b>Permitir estoque negativo</b><small>Desligado por padrão para evitar saídas acima do físico.</small></span><input id="cfg-negative" type="checkbox" ${state.config.allowNegativeStock ? 'checked' : ''}/></label><label class="setting-row"><span><b>Estoque mínimo padrão</b><small>Aplicado a novos produtos.</small></span><input id="cfg-min" class="small-input" type="number" min="0" step="0.001" value="${state.config.defaultMinimumStock}"/></label></div><div class="panel settings-card"><div class="panel-head"><div><h2>Dados</h2><p>Backup e migração.</p></div></div><div class="setting-actions">${actionBtn('Exportar backup', 'export-json', 'download')} ${actionBtn('Exportar CSV', 'export-csv', 'download')} ${actionBtn('Importar backup', 'import-backup', 'upload')} ${actionBtn('Imprimir relatório', 'print-report', 'print')}</div><div class="data-note"><span>${icon('shield', 17)}</span><p><b>Banco local seguro por estrutura</b><br/>A v9 usa IndexedDB em navegador suportado e mantém exportação manual como camada de recuperação.</p></div></div></div>`; }
function empty(title, text, iconName = 'box') { return `<div class="empty-state"><div class="empty-icon">${icon(iconName, 28)}</div><b>${title}</b><span>${text}</span></div>`; }
function openProductDrawer(productId) {
    const p = productId ? getProduct(productId) : undefined;
    const isNew = !p;
    const cats = state.categories;
    const sups = state.suppliers.filter(s => s.active);
    const html = `<div class="drawer-overlay" data-action="close-drawer"><aside class="drawer" data-stop><div class="drawer-head"><div><div class="eyebrow">${isNew ? 'NOVO CADASTRO' : 'FICHA DO PRODUTO'}</div><h2>${isNew ? 'Novo produto' : esc(p.name)}</h2><p>${isNew ? 'Cadastre material com estoque mínimo e fornecedor.' : esc(p.code)}</p></div><button class="icon-btn" data-action="close-drawer">${icon('close', 20)}</button></div><div class="drawer-body">
    <div class="form-section"><div class="form-section-title">Identificação</div><label>Nome *<input id="p-name" value="${esc(p?.name || '')}" /></label><div class="form-grid"><label>Código<input id="p-code" value="${esc(p?.code || '')}" /></label><label>Unidade<select id="p-unit">${['un', 'cx', 'pct', 'par', 'kg', 'g', 'L', 'mL', 'm', 'dz', 'ct'].map(u => `<option ${p?.unit === u ? 'selected' : ''}>${u}</option>`).join('')}</select></label></div><div class="form-grid"><label>Categoria<select id="p-cat">${cats.map(c => `<option value="${c.id}" ${p?.categoryId === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label><label>Fornecedor<select id="p-sup"><option value="">Sem fornecedor</option>${sups.map(s => `<option value="${s.id}" ${p?.supplierId === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></label></div></div>
    <div class="form-section"><div class="form-section-title">Estoque e custo</div><div class="form-grid"><label>Estoque atual<input id="p-stock" type="number" min="0" step="0.001" value="${p?.currentStock ?? 0}" ${isNew ? '' : 'disabled'} /></label><label>Estoque mínimo<input id="p-min" type="number" min="0" step="0.001" value="${p?.minimumStock ?? state.config.defaultMinimumStock}" /></label></div><div class="form-grid"><label>Custo atual<input id="p-cost" type="number" min="0" step="0.01" value="${p?.currentCost ?? 0}" /></label><label>Estoque máximo<input id="p-max" type="number" min="0" step="0.001" value="${p?.maximumStock ?? ''}" placeholder="Opcional" /></label></div></div>
    ${!isNew ? `<div class="form-section"><div class="detail-strip"><div><span>Disponível</span><b>${qty(Math.max(0, p.currentStock - p.reservedStock))}</b></div><div><span>Valor estoque</span><b>${money(p.currentStock * p.currentCost)}</b></div><div><span>Status</span><b class="${statusClass(statusFor(p))}">${statusLabel(statusFor(p))}</b></div></div></div>` : ''}
  </div><div class="drawer-foot">${!isNew ? `<button class="btn btn-danger ghost" data-action="delete-product" data-id="${p.id}">${icon('trash', 15)} Excluir</button>` : '<span></span>'}<div><button class="btn btn-secondary" data-action="close-drawer">Cancelar</button><button class="btn btn-primary" data-action="save-product" data-id="${p?.id || ''}">${icon('check', 15)} ${isNew ? 'Criar produto' : 'Salvar alterações'}</button></div></div></aside></div>`;
    const root = document.getElementById('drawer-root');
    root.innerHTML = html;
    requestAnimationFrame(() => root.querySelector('.drawer-overlay')?.classList.add('open'));
}
function openSupplierDrawer(supplierId) { const s = supplierId ? getSupplier(supplierId) : undefined; const ps = state.products.filter(p => p.supplierId === supplierId); const html = `<div class="drawer-overlay" data-action="close-drawer"><aside class="drawer" data-stop><div class="drawer-head"><div><div class="eyebrow">FORNECEDOR</div><h2>${s ? esc(s.name) : 'Novo fornecedor'}</h2><p>${s ? esc(s.cnpj || 'Cadastro sem CNPJ') : 'Dados de contato e compra'}</p></div><button class="icon-btn" data-action="close-drawer">${icon('close', 20)}</button></div><div class="drawer-body"><div class="form-section"><div class="form-section-title">Identificação</div><label>Nome *<input id="s-name" value="${esc(s?.name || '')}" /></label><div class="form-grid"><label>CNPJ<input id="s-cnpj" value="${esc(s?.cnpj || '')}" /></label><label>Contato<input id="s-contact" value="${esc(s?.contact || '')}" /></label></div><div class="form-grid"><label>Telefone<input id="s-phone" value="${esc(s?.phone || '')}" /></label><label>WhatsApp<input id="s-whatsapp" value="${esc(s?.whatsapp || '')}" /></label></div><label>E-mail<input id="s-email" value="${esc(s?.email || '')}" /></label><div class="form-grid"><label>Prazo médio (dias)<input id="s-lead" type="number" min="0" value="${s?.averageLeadDays ?? ''}" /></label><label>Condição pagamento<input id="s-payment" value="${esc(s?.paymentTerms || '')}" /></label></div></div>${s ? `<div class="form-section"><div class="form-section-title">Produtos vinculados</div>${ps.slice(0, 12).map(p => `<button class="mini-product-row" data-product="${p.id}"><span>${esc(p.name)}<small>${esc(p.code)}</small></span><b>${money(p.currentCost)}</b>${icon('arrow', 14)}</button>`).join('') || '<span class="muted">Nenhum produto vinculado.</span>'}</div>` : ''}</div><div class="drawer-foot">${s ? `<button class="btn btn-danger ghost" data-action="delete-supplier" data-id="${s.id}">${icon('trash', 15)} Desativar</button>` : '<span></span>'}<div><button class="btn btn-secondary" data-action="close-drawer">Cancelar</button><button class="btn btn-primary" data-action="save-supplier" data-id="${s?.id || ''}">${icon('check', 15)} Salvar fornecedor</button></div></div></aside></div>`; const root = document.getElementById('drawer-root'); root.innerHTML = html; requestAnimationFrame(() => root.querySelector('.drawer-overlay')?.classList.add('open')); }
function openMovementModal() { const products = state.products.filter(p => p.active).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')); showModal('Nova movimentação', `<div class="modal-grid"><label>Produto<select id="m-product">${products.map(p => `<option value="${p.id}">${esc(p.name)} · ${qty(p.currentStock)} ${esc(p.unit)}</option>`).join('')}</select></label><label>Tipo<select id="m-type"><option value="entrada">Entrada</option><option value="saida">Saída</option><option value="ajuste">Ajuste de saldo</option><option value="devolucao">Devolução</option><option value="transferencia">Transferência</option></select></label></div><div class="modal-grid"><label>Quantidade<input id="m-qty" type="number" min="0.001" step="0.001" value="1" /></label><label>Custo unitário<input id="m-cost" type="number" min="0" step="0.01" value="0" /></label></div><div class="modal-grid"><label>Documento<input id="m-doc" placeholder="NF-e, OS, inventário..." /></label><label>Responsável<input id="m-resp" placeholder="Nome" /></label></div><div class="modal-grid"><label>Ordem de serviço<input id="m-os" placeholder="Opcional" /></label><label>Veículo<input id="m-vehicle" placeholder="Opcional" /></label></div><label>Observação<textarea id="m-note" rows="3" placeholder="Motivo, origem ou destino..."></textarea></label><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="save-movement">${icon('check', 15)} Registrar</button></div>`); }
function openQuoteModal() {
    const products = state.products.filter(p => p.active);
    showModal('Novo orçamento', `<div class="modal-grid"><label>Cliente<input id="q-customer" placeholder="Cliente / empresa" /></label><label>Validade<input id="q-valid" type="date" /></label></div><label>Título<input id="q-title" placeholder="Ex.: Materiais para recuperação - OS 1234" /></label><label>Adicionar produto<select id="q-product"><option value="">Selecione...</option>${products.map(p => `<option value="${p.id}">${esc(p.name)} · ${money(p.currentCost)}</option>`).join('')}</select></label><div id="q-cart" class="quote-cart-empty">Nenhum item.</div><label>Observações<textarea id="q-notes" rows="3"></textarea></label><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="save-quote">${icon('check', 15)} Salvar orçamento</button></div>`);
    let cart = [];
    const select = document.getElementById('q-product');
    const cartEl = document.getElementById('q-cart');
    const paint = () => { cartEl.innerHTML = cart.length ? cart.map((x, i) => { const p = getProduct(x.productId); return `<div class="cart-row"><span>${esc(p.name)}<small>${money(x.unitPrice)} / un</small></span><input class="small-number" data-q-idx="${i}" type="number" min="1" step="1" value="${x.quantity}" /><b>${money(x.quantity * x.unitPrice)}</b><button class="icon-btn" data-q-remove="${i}">${icon('trash', 14)}</button></div>`; }).join('') : '<span class="muted">Nenhum item.</span>'; };
    select.addEventListener('change', () => { const id = select.value; if (!id)
        return; const p = getProduct(id); const existing = cart.find(i => i.productId === id); if (existing)
        existing.quantity += 1;
    else
        cart.push({ productId: id, quantity: 1, unitPrice: p.currentCost }); select.value = ''; paint(); });
    cartEl.addEventListener('input', e => { const el = e.target.closest('[data-q-idx]'); if (el)
        cart[Number(el.dataset.qIdx)].quantity = Math.max(1, Number(el.value) || 1); });
    cartEl.addEventListener('click', e => { const el = e.target.closest('[data-q-remove]'); if (el) {
        cart.splice(Number(el.dataset.qRemove), 1);
        paint();
    } });
    window._quoteCart = () => cart;
}
function showModal(title, body) { const root = document.getElementById('modal-root'); root.innerHTML = `<div class="modal-overlay" data-action="close-modal"><div class="modal" data-stop><div class="modal-head"><div><div class="eyebrow">AÇÃO</div><h2>${title}</h2></div><button class="icon-btn" data-action="close-modal">${icon('close', 20)}</button></div><div class="modal-body">${body}</div></div></div>`; requestAnimationFrame(() => root.querySelector('.modal-overlay')?.classList.add('open')); }
async function saveProduct(id) {
    const name = document.getElementById('p-name').value.trim().toUpperCase();
    if (!name) {
        toast('Nome do produto é obrigatório', 'error');
        return;
    }
    const categoryId = document.getElementById('p-cat').value;
    const supplierId = document.getElementById('p-sup').value || undefined;
    const code = document.getElementById('p-code').value.trim() || '—';
    const unit = document.getElementById('p-unit').value;
    const min = Math.max(0, Number(document.getElementById('p-min').value) || 0);
    const cost = Math.max(0, Number(document.getElementById('p-cost').value) || 0);
    const maxValue = Number(document.getElementById('p-max').value);
    const p = id ? getProduct(id) : undefined;
    if (!p) {
        const newProduct = { id: uid('p'), code, name, supplierId, supplierNameLegacy: getSupplier(supplierId)?.name, categoryId, unit, currentStock: Math.max(0, Number(document.getElementById('p-stock').value) || 0), minimumStock: min, reservedStock: 0, currentCost: cost, averageCost: cost, maximumStock: Number.isFinite(maxValue) && maxValue > 0 ? maxValue : undefined, active: true, createdAt: now(), updatedAt: now(), legacySource: 'manual' };
        await db.put('products', newProduct);
        state.products.unshift(newProduct);
        log('create', `Produto criado: ${name}`, `Código ${code}`, 'product', newProduct.id);
        toast('Produto criado');
    }
    else {
        Object.assign(p, { code, name, supplierId, supplierNameLegacy: getSupplier(supplierId)?.name, categoryId, unit, minimumStock: min, currentCost: cost, averageCost: p.averageCost || cost, maximumStock: Number.isFinite(maxValue) && maxValue > 0 ? maxValue : undefined, updatedAt: now() });
        await db.put('products', p);
        log('update', `Produto alterado: ${name}`, 'Cadastro atualizado', 'product', p.id);
        toast('Alterações salvas');
    }
    closeDrawer();
    render();
}
async function deleteProduct(id) { const p = getProduct(id); if (!p)
    return; if (!confirm(`Desativar “${p.name}”? O histórico será preservado.`))
    return; p.active = false; p.updatedAt = now(); await db.put('products', p); log('delete', `Produto desativado: ${p.name}`, 'Histórico preservado', 'product', p.id); closeDrawer(); render(); toast('Produto desativado', 'warning'); }
async function saveSupplier(id) { const name = document.getElementById('s-name').value.trim().toUpperCase(); if (!name) {
    toast('Nome do fornecedor é obrigatório', 'error');
    return;
} let s = id ? getSupplier(id) : undefined; if (!s) {
    s = { id: uid('sup'), name, active: true, createdAt: now(), updatedAt: now(), cnpj: document.getElementById('s-cnpj').value.trim(), contact: document.getElementById('s-contact').value.trim(), phone: document.getElementById('s-phone').value.trim(), whatsapp: document.getElementById('s-whatsapp').value.trim(), email: document.getElementById('s-email').value.trim(), averageLeadDays: Math.max(0, Number(document.getElementById('s-lead').value) || 0), paymentTerms: document.getElementById('s-payment').value.trim() };
    state.suppliers.push(s);
    await db.put('suppliers', s);
    log('create', `Fornecedor criado: ${name}`, '');
}
else {
    Object.assign(s, { name, cnpj: document.getElementById('s-cnpj').value.trim(), contact: document.getElementById('s-contact').value.trim(), phone: document.getElementById('s-phone').value.trim(), whatsapp: document.getElementById('s-whatsapp').value.trim(), email: document.getElementById('s-email').value.trim(), averageLeadDays: Math.max(0, Number(document.getElementById('s-lead').value) || 0), paymentTerms: document.getElementById('s-payment').value.trim(), updatedAt: now() });
    await db.put('suppliers', s);
    log('update', `Fornecedor alterado: ${name}`, 'Cadastro atualizado', 'supplier', s.id);
} closeDrawer(); render(); toast('Fornecedor salvo'); }
async function deleteSupplier(id) { const s = getSupplier(id); if (!s)
    return; if (!confirm(`Desativar ${s.name}?`))
    return; s.active = false; s.updatedAt = now(); await db.put('suppliers', s); log('delete', `Fornecedor desativado: ${s.name}`, 'Produtos vinculados permanecem cadastrados.', 'supplier', id); closeDrawer(); render(); toast('Fornecedor desativado', 'warning'); }
async function saveMovement() {
    const product = getProduct(document.getElementById('m-product').value);
    if (!product) {
        toast('Produto inválido', 'error');
        return;
    }
    const type = document.getElementById('m-type').value;
    const amount = Math.max(0, Number(document.getElementById('m-qty').value) || 0);
    if (!(amount > 0)) {
        toast('Informe uma quantidade válida', 'error');
        return;
    }
    const current = product.currentStock;
    let next = current;
    if (type === 'entrada' || type === 'devolucao')
        next = current + amount;
    else if (type === 'saida' || type === 'transferencia')
        next = current - amount;
    else
        next = amount;
    if (next < 0 && !state.config.allowNegativeStock) {
        toast(`Estoque insuficiente. Disponível: ${qty(current)}.`, 'error');
        return;
    }
    const cost = Math.max(0, Number(document.getElementById('m-cost').value) || product.currentCost);
    if (type === 'entrada' && amount > 0 && cost > 0) {
        const totalBefore = product.averageCost * current;
        const totalIn = cost * amount;
        product.averageCost = (totalBefore + totalIn) / (current + amount || 1);
        product.currentCost = cost;
        product.lastPurchaseAt = now();
    }
    if (type === 'saida' || type === 'transferencia' || type === 'devolucao')
        product.currentStock = next;
    else if (type === 'entrada')
        product.currentStock = next;
    else
        product.currentStock = next;
    product.updatedAt = now();
    const m = { id: uid('mov'), productId: product.id, productCode: product.code, productName: product.name, type, quantity: amount, unitCost: cost, document: document.getElementById('m-doc').value.trim(), responsible: document.getElementById('m-resp').value.trim(), workOrder: document.getElementById('m-os').value.trim(), vehicle: document.getElementById('m-vehicle').value.trim(), note: document.getElementById('m-note').value.trim(), createdAt: now() };
    state.movements.unshift(m);
    await db.put('movements', m);
    await db.put('products', product);
    log('movement', `${typeLabel(type)} · ${product.name}`, `${type === 'ajuste' ? 'Saldo final: ' + qty(next) : 'Quantidade: ' + qty(amount)} · Documento: ${m.document || '—'}`, 'movement', m.id);
    closeModal();
    render();
    toast('Movimentação registrada');
}
function typeLabel(t) { return t === 'entrada' ? 'Entrada' : t === 'saida' ? 'Saída' : t === 'ajuste' ? 'Ajuste' : t === 'devolucao' ? 'Devolução' : 'Transferência'; }
async function saveInventory() { const inputs = [...document.querySelectorAll('.inventory-input')]; let changes = 0; for (const input of inputs) {
    if (input.value === '')
        continue;
    const p = getProduct(input.dataset.product || '');
    if (!p)
        continue;
    const counted = Number(input.value);
    if (!Number.isFinite(counted) || counted < 0)
        continue;
    if (counted === p.currentStock)
        continue;
    const before = p.currentStock;
    p.currentStock = counted;
    p.updatedAt = now();
    const m = { id: uid('mov'), productId: p.id, productCode: p.code, productName: p.name, type: 'ajuste', quantity: Math.abs(counted - before), unitCost: p.currentCost, document: 'INVENTÁRIO', note: `Ajuste de ${qty(before)} para ${qty(counted)}`, createdAt: now() };
    state.movements.unshift(m);
    await db.put('movements', m);
    await db.put('products', p);
    log('inventory', `Inventário ajustado: ${p.name}`, `${qty(before)} → ${qty(counted)}`, 'product', p.id);
    changes++;
} toast(changes ? `${changes} ajustes registrados` : 'Nenhuma diferença para ajustar', changes ? 'success' : 'warning'); render(); }
async function saveQuote() { const cart = (window._quoteCart?.() ?? []); const q = { id: uid('quote'), number: `ORC-${new Date().getFullYear()}-${String(state.quotes.length + 1).padStart(4, '0')}`, customer: document.getElementById('q-customer').value.trim(), title: document.getElementById('q-title').value.trim() || 'Orçamento', validUntil: document.getElementById('q-valid').value || undefined, status: 'draft', notes: document.getElementById('q-notes').value.trim(), items: cart, createdAt: now(), updatedAt: now() }; state.quotes.unshift(q); await db.put('quotes', q); log('create', `Orçamento criado: ${q.number}`, `${q.items.length} itens · ${money(quoteTotal(q))}`, 'quote', q.id); closeModal(); render(); toast('Orçamento salvo'); }
function openNfeDetail(nfeId) { const n = state.nfe.find(x => x.id === nfeId); if (!n)
    return; const items = state.nfeItems.filter(i => i.nfeId === n.id); showModal('Revisar NF-e', `<div class="detail-grid"><div><span>Status</span><b>${esc(n.status)}</b></div><div><span>Origem</span><b>${esc(n.sourceType.toUpperCase())}</b></div><div><span>Fornecedor</span><b>${esc(n.supplierName || '—')}</b></div><div><span>Número</span><b>${esc(n.number || '—')}</b></div><div><span>Data</span><b>${dateOnly(n.issueDate)}</b></div><div><span>Total</span><b>${money(n.total || 0)}</b></div></div><div class="data-note"><span>${icon(n.sourceType === 'pdf' ? 'file' : 'check', 17)}</span><p><b>${esc(n.sourceName)}</b><br/>${esc(n.note || 'Documento pronto para conferência.')}</p></div>${items.length ? `<div class="modal-subtitle">Itens reconhecidos</div><div class="table-wrap mini-table"><table><thead><tr><th>Produto</th><th>Qtd.</th><th>Custo</th><th>Status</th></tr></thead><tbody>${items.map(i => `<tr><td>${esc(i.description)}</td><td>${qty(i.quantity)}</td><td>${money(i.unitCost)}</td><td>${esc(i.status)}</td></tr>`).join('')}</tbody></table></div>` : ''}<div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Fechar</button>${n.status !== 'processed' ? `<button class="btn btn-primary" data-action="process-nfe" data-id="${n.id}">${icon('check', 15)} Marcar como conferida</button>` : ''}</div>`); }
async function processNfe(id) { const n = state.nfe.find(x => x.id === id); if (!n)
    return; n.status = 'processed'; await db.put('nfe', n); log('import', `NF-e conferida: ${n.sourceName}`, 'Documento marcado como processado.', 'nfe', id); closeModal(); render(); toast('NF-e marcada como conferida'); }
function scanCode() { showModal('Consultar código', `<div class="scan-box"><div class="scan-visual">${icon('barcode', 56)}</div><p>Digite ou cole o código interno/EAN. Em navegadores que suportam BarcodeDetector, o leitor por câmera pode ser adicionado ao adaptador PWA.</p><label>Código<input id="scan-code" autofocus placeholder="Ex.: 7891645083014" /></label><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="lookup-code">${icon('search', 15)} Consultar</button></div></div>`); setTimeout(() => document.getElementById('scan-code')?.focus(), 50); }
function lookupCode() { const code = document.getElementById('scan-code')?.value.trim(); if (!code)
    return toast('Informe um código', 'warning'); const p = state.products.find(x => x.code === code); if (!p) {
    toast('Código não encontrado', 'error');
    return;
} closeModal(); openProductDrawer(p.id); }
async function parsePdfMetadata(_file) { return null; }
async function importFile(file) { const ext = file.name.split('.').pop()?.toLowerCase(); if (ext === 'json') {
    try {
        const parsed = JSON.parse(await file.text());
        await importSnapshot(parsed, file.name);
    }
    catch (e) {
        toast('JSON inválido', 'error');
    }
}
else if (ext === 'csv' || file.type === 'text/csv') {
    await importCsv(await file.text(), file.name);
}
else if (ext === 'pdf' || file.type === 'application/pdf') {
    const meta = await parsePdfMetadata(file);
    const n = { id: uid('nfe'), sourceName: file.name, sourceType: 'pdf', status: 'review', createdAt: now(), fileBlob: file, number: meta?.number, key: meta?.key, cnpj: meta?.cnpj, issueDate: meta?.issueDate, total: meta?.total, note: meta ? 'Texto extraído pelo PDF.js. Itens ainda passam por conferência antes de atualizar o estoque.' : 'PDF armazenado localmente; instale as dependências da pasta de projeto para habilitar a leitura PDF.js.' };
    state.nfe.unshift(n);
    await db.put('nfe', n);
    log('import', `NF-e recebida: ${file.name}`, meta ? 'Metadados extraídos pelo PDF.js.' : 'PDF colocado em fila de conferência.', 'nfe', n.id);
    toast(meta ? 'PDF lido e colocado para revisão' : 'PDF adicionado à fila de NF-e', 'warning');
    render();
}
else
    toast('Formato não suportado', 'error'); }
async function importCsv(text, name) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
        toast('CSV vazio', 'error');
        return;
    }
    const headers = lines[0].split(';').map(x => norm(x));
    const idx = (...names) => headers.findIndex(h => names.some(n => h.includes(n)));
    const iCode = idx('codigo', 'id', 'sku'), iName = idx('produto', 'nome', 'descricao'), iQty = idx('quantidade', 'qtd'), iUnit = idx('unidade', 'un'), iCost = idx('preco', 'custo', 'valor');
    const n = { id: uid('nfe'), sourceName: name, sourceType: 'csv', status: 'new', createdAt: now(), note: `${lines.length - 1} linhas importadas` };
    await db.put('nfe', n);
    state.nfe.unshift(n);
    let applied = 0;
    for (const line of lines.slice(1)) {
        const cells = line.split(';');
        const code = (cells[iCode] || '').trim();
        const nameValue = (cells[iName] || '').trim().toUpperCase();
        const amount = Math.max(0, Number((cells[iQty] || '0').replace(',', '.')) || 0);
        const cost = Math.max(0, Number((cells[iCost] || '0').replace('.', '').replace(',', '.')) || 0);
        if (!nameValue)
            continue;
        let p = state.products.find(x => (code && x.code === code) || norm(x.name) === norm(nameValue));
        if (p) {
            p.currentCost = cost || p.currentCost;
            p.currentStock += amount;
            p.averageCost = p.averageCost ? p.averageCost : cost;
            p.updatedAt = now();
            await db.put('products', p);
            if (amount > 0) {
                const m = { id: uid('mov'), productId: p.id, productCode: p.code, productName: p.name, type: 'entrada', quantity: amount, unitCost: cost || p.currentCost, document: name, createdAt: now() };
                state.movements.unshift(m);
                await db.put('movements', m);
            }
            applied++;
        }
    }
    n.status = 'processed';
    await db.put('nfe', n);
    log('import', `CSV processado: ${name}`, `${applied} produtos atualizados`, 'nfe', n.id);
    toast(`Importação concluída: ${applied} produtos`);
    render();
}
async function importSnapshot(parsed, name) {
    let products = Array.isArray(parsed) ? parsed : Array.isArray(parsed.products) ? parsed.products : Array.isArray(parsed.produtos) ? parsed.produtos : [];
    if (!products.length) {
        toast('Backup sem produtos', 'error');
        return;
    }
    const ok = confirm(`Importar ${products.length} produtos do arquivo “${name}”?\n\nOK = mesclar\nCancelar = abortar`);
    if (!ok)
        return;
    let created = 0, updated = 0;
    for (const raw of products) {
        const code = String(raw.code ?? raw.id ?? '—').trim();
        const nameValue = String(raw.name ?? raw.nome ?? '').trim().toUpperCase();
        if (!nameValue)
            continue;
        const found = state.products.find(p => p.code === code && norm(p.name) === norm(nameValue));
        if (found) {
            Object.assign(found, { currentCost: Number(raw.currentCost ?? raw.preco) || found.currentCost, averageCost: Number(raw.averageCost ?? raw.preco) || found.averageCost, currentStock: Number(raw.currentStock ?? raw.estoqueAtual ?? raw.quantidade) || 0, minimumStock: Number(raw.minimumStock ?? 2) });
            await db.put('products', found);
            updated++;
        }
        else {
            const catName = String(raw.categoryName ?? raw.categoria ?? 'Outros');
            let cat = state.categories.find(c => c.name === catName);
            if (!cat) {
                cat = { id: uid('cat'), name: catName, icon: CATEGORY_META[catName]?.icon ?? 'Lista', tone: CATEGORY_META[catName]?.tone ?? 'slate' };
                state.categories.push(cat);
                await db.put('categories', cat);
            }
            const supplierName = String(raw.supplierNameLegacy ?? raw.supplier ?? raw.fornecedor ?? '').trim();
            let supplierId;
            if (supplierName && supplierName !== '?' && supplierName !== '—') {
                let supplier = state.suppliers.find(x => x.name === supplierName);
                if (!supplier) {
                    supplier = { id: uid('sup'), name: supplierName, active: true, createdAt: now(), updatedAt: now() };
                    state.suppliers.push(supplier);
                    await db.put('suppliers', supplier);
                }
                supplierId = supplier.id;
            }
            const p = { id: uid('p'), code, name: nameValue, supplierId, supplierNameLegacy: supplierName, categoryId: cat.id, unit: String(raw.unit ?? raw.unidade ?? 'un'), currentStock: Number(raw.currentStock ?? raw.estoqueAtual ?? raw.quantidade) || 0, minimumStock: Number(raw.minimumStock ?? 2), reservedStock: 0, currentCost: Number(raw.currentCost ?? raw.preco) || 0, averageCost: Number(raw.averageCost ?? raw.preco) || 0, active: true, createdAt: now(), updatedAt: now(), legacySource: 'v8-import' };
            state.products.push(p);
            await db.put('products', p);
            created++;
        }
    }
    log('import', `Backup importado: ${name}`, `${created} novos · ${updated} atualizados`);
    toast(`Importação concluída: ${created} novos · ${updated} atualizados`);
    render();
}
function exportSnapshot() { const snapshot = { products: state.products, suppliers: state.suppliers, categories: state.categories, movements: state.movements, nfe: state.nfe.map(n => { const { fileBlob, ...safe } = n; return safe; }), nfeItems: state.nfeItems, quotes: state.quotes, audit: state.audit, config: state.config }; downloadText(`almoxarifado-v9-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(snapshot, null, 2), 'application/json'); log('export', 'Backup JSON exportado', 'Snapshot completo'); toast('Backup JSON exportado'); }
function exportCsv() { const rows = [['Código', 'Produto', 'Fornecedor', 'Categoria', 'Unidade', 'Estoque', 'Mínimo', 'Custo atual', 'Valor estoque', 'Status']]; for (const p of state.products) {
    rows.push([p.code, p.name, getSupplier(p.supplierId)?.name || p.supplierNameLegacy || '', getCategory(p.categoryId)?.name || '', p.unit, String(p.currentStock).replace('.', ','), String(p.minimumStock).replace('.', ','), String(p.currentCost).replace('.', ','), String(p.currentStock * p.currentCost).replace('.', ','), statusLabel(statusFor(p))]);
} downloadText('almoxarifado-produtos.csv', rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(';')).join('\n'), 'text/csv;charset=utf-8'); log('export', 'CSV de produtos exportado'); toast('CSV exportado'); }
function downloadText(name, text, type) { const blob = new Blob([text], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 500); }
function commandPalette() { showModal('Ações rápidas', `<div class="command-list">${[['new-product', 'Novo produto', 'box'], ['new-movement', 'Registrar movimentação', 'layers'], ['import-nfe', 'Importar NF-e', 'filePlus'], ['new-quote', 'Novo orçamento', 'receipt'], ['inventory', 'Abrir inventário', 'clipboard'], ['scan-code', 'Consultar código / código de barras', 'barcode'], ['export-json', 'Exportar backup', 'download']].map(x => `<button class="command-item" data-action="${x[0]}"><span>${icon(x[2], 17)}</span><b>${x[1]}</b>${icon('arrow', 14)}</button>`).join('')}</div>`); }
function closeDrawer() { const root = document.getElementById('drawer-root'); if (!root)
    return; const ov = root.querySelector('.drawer-overlay'); ov?.classList.remove('open'); setTimeout(() => root.innerHTML = '', 160); }
function closeModal() { document.getElementById('modal-root').innerHTML = ''; }
async function applyConfig() { const negative = document.getElementById('cfg-negative')?.checked; if (negative !== undefined) {
    state.config.allowNegativeStock = negative;
    state.config.defaultMinimumStock = Math.max(0, Number(document.getElementById('cfg-min').value) || 0);
    await db.put('config', state.config);
    log('system', 'Configurações atualizadas');
    toast('Configurações salvas');
} }
function printReport() { window.print(); }
function wire() {
    document.addEventListener('click', async (e) => {
        const t = e.target;
        const v = t.closest('[data-view]');
        if (v) {
            state.view = v.dataset.view;
            state.mobileNav = false;
            render();
            return;
        }
        const p = t.closest('[data-product]');
        if (p) {
            openProductDrawer(p.dataset.product);
            return;
        }
        const s = t.closest('[data-supplier]');
        if (s) {
            openSupplierDrawer(s.dataset.supplier);
            return;
        }
        const q = t.closest('[data-quote]');
        if (q) {
            openQuoteModal();
            return;
        }
        const n = t.closest('[data-nfe]');
        if (n) {
            openNfeDetail(n.dataset.nfe);
            return;
        }
        const c = t.closest('[data-category]');
        if (c) {
            state.view = 'products';
            state.categoryId = c.dataset.category || '';
            render();
            return;
        }
        const a = t.closest('[data-action]');
        if (!a)
            return;
        const action = a.dataset.action;
        if (NAV.some(n => n.id === action)) {
            state.view = action;
            state.mobileNav = false;
            render();
            return;
        }
        if (action === 'toggle-nav') {
            state.mobileNav = !state.mobileNav;
            render();
            return;
        }
        if (action === 'theme') {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            state.config.theme = state.theme;
            await db.put('config', state.config);
            render();
            return;
        }
        if (action === 'new-product') {
            openProductDrawer();
            return;
        }
        if (action === 'new-supplier') {
            openSupplierDrawer();
            return;
        }
        if (action === 'new-movement') {
            openMovementModal();
            return;
        }
        if (action === 'new-quote') {
            openQuoteModal();
            return;
        }
        if (action === 'import-nfe' || action === 'nfe-drop') {
            document.getElementById('nfe-file')?.click();
            return;
        }
        if (action === 'import-backup') {
            document.getElementById('global-file')?.click();
            return;
        }
        if (action === 'export-json') {
            exportSnapshot();
            return;
        }
        if (action === 'export-csv') {
            exportCsv();
            return;
        }
        if (action === 'print-report') {
            printReport();
            return;
        }
        if (action === 'command') {
            commandPalette();
            return;
        }
        if (action === 'clear-filters') {
            state.query = '';
            state.categoryId = '';
            state.supplierId = '';
            state.stockStatus = '';
            state.sort = 'name';
            render();
            return;
        }
        if (action === 'close-drawer') {
            closeDrawer();
            return;
        }
        if (action === 'close-modal') {
            closeModal();
            return;
        }
        if (action === 'save-product') {
            await saveProduct(a.dataset.id || undefined);
            return;
        }
        if (action === 'delete-product') {
            await deleteProduct(a.dataset.id);
            return;
        }
        if (action === 'save-supplier') {
            await saveSupplier(a.dataset.id || undefined);
            return;
        }
        if (action === 'delete-supplier') {
            await deleteSupplier(a.dataset.id);
            return;
        }
        if (action === 'save-movement') {
            await saveMovement();
            return;
        }
        if (action === 'save-inventory') {
            await saveInventory();
            return;
        }
        if (action === 'save-quote') {
            await saveQuote();
            return;
        }
        if (action === 'process-nfe') {
            await processNfe(a.dataset.id);
            return;
        }
        if (action === 'scan-code') {
            scanCode();
            return;
        }
        if (action === 'lookup-code') {
            lookupCode();
            return;
        }
    });
    document.addEventListener('input', e => { const t = e.target; if (t.id === 'query') {
        const pos = t.selectionStart ?? t.value.length;
        state.query = t.value;
        render();
        const q = document.getElementById('query');
        if (q) {
            q.focus();
            q.setSelectionRange(pos, pos);
        }
        return;
    } if (t.matches('.inventory-input')) {
        const p = getProduct(t.dataset.product || '');
        const cell = document.querySelector(`[data-diff="${t.dataset.product}"]`);
        if (cell && p && t.value !== '') {
            const diff = Number(t.value) - p.currentStock;
            cell.textContent = (diff > 0 ? '+' : '') + qty(diff);
            cell.className = `inventory-diff ${diff === 0 ? 'zero' : diff > 0 ? 'positive' : 'negative'}`;
        }
        return;
    } });
    document.addEventListener('change', e => { const t = e.target; if (t.id === 'cat-filter') {
        state.categoryId = t.value;
        render();
    }
    else if (t.id === 'supplier-filter') {
        state.supplierId = t.value;
        render();
    }
    else if (t.id === 'stock-filter') {
        state.stockStatus = t.value;
        render();
    }
    else if (t.id === 'sort-filter') {
        state.sort = t.value;
        render();
    }
    else if (t.id === 'nfe-file') {
        const file = t.files?.[0];
        if (file)
            importFile(file);
    }
    else if (t.id === 'global-file') {
        const file = t.files?.[0];
        if (file)
            importFile(file);
    }
    else if (t.id?.startsWith('cfg-')) {
        applyConfig();
    } });
    document.addEventListener('dragover', e => { const zone = e.target.closest('#nfe-drop'); if (zone) {
        e.preventDefault();
        zone.classList.add('dragging');
    } });
    document.addEventListener('dragleave', e => { const zone = e.target.closest('#nfe-drop'); if (zone)
        zone.classList.remove('dragging'); });
    document.addEventListener('drop', e => { const zone = e.target.closest('#nfe-drop'); if (zone) {
        e.preventDefault();
        zone.classList.remove('dragging');
        const file = e.dataTransfer?.files?.[0];
        if (file)
            importFile(file);
    } });
    document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        commandPalette();
    } if (e.key === 'Escape') {
        closeModal();
        closeDrawer();
    } });
}
function mountHiddenInputs() { const a = document.createElement('input'); a.type = 'file'; a.id = 'global-file'; a.accept = '.json,.csv,.txt'; a.hidden = true; document.body.appendChild(a); }
async function init() {
    mountHiddenInputs();
    wire();
    const migrated = await tryLegacyMigration();
    const snapshot = await seedDatabase();
    state = { ...state, ...snapshot, theme: snapshot.config.theme };
    if (migrated)
        toast('Dados da v8 migrados para o banco local');
    render();
    if ('serviceWorker' in navigator && location.protocol !== 'file:')
        navigator.serviceWorker.register('/sw.js').catch(() => { });
}
function render() { document.getElementById('app').innerHTML = shell(); }
init().catch(err => { document.getElementById('app').innerHTML = `<div style="padding:40px;font-family:system-ui;color:#fff;background:#0b1118;min-height:100vh"><h1>Não foi possível iniciar</h1><p>${esc(err?.message || err)}</p></div>`; });
