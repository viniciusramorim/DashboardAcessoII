const express = require('express');
const path = require('path');
const sql = require('mssql');
const app = express();
const cors = require('cors');
const port = 5000;

app.use(cors());

// Configuração do banco de dados
const dbConfig = {
  user: 'lenel',
  password: 'Secur1ty#',
  server: '10.238.102.72', // ou o endereço do seu servidor SQL
  database: 'AccessControl',
  options: {
    encrypt: true, // Use esta opção se estiver usando o Azure SQL
    trustServerCertificate: true // Use esta opção se estiver usando um servidor local
  }
};

// Conectar ao banco de dados
sql.connect(dbConfig, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados.');
});

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para consultar a view
app.get('/dados-eco', async (req, res) => {
  const apiKey = req.query.key;

  // Validação da chave da API
  if (!apiKey || apiKey !== 'minha-chave') {
    return res.status(401).json({ erro: 'Acesso não autorizado. Chave inválida.' });
  }

  try {
    const result = await sql.query(`
        SELECT [DT_EVENT],
               [EVENT_TIME],
               [EMPID],
               [LASTNAME],
               [FIRSTNAME],
               [MIDNAME],
               [SSNO],
               [NAME],
               [CARDNUM],
               [DEVID],
               [EVTDESCR],
               [EVDESCR],
               [MACHINE],
               [READERDESC],
               [IM_DT_UPDATE]
        FROM [AccessControl].[dbo].[VW_VIVO_CONSULTA_RH]
        WHERE LASTNAME IS NOT NULL 
          AND CAST(DT_EVENT AS DATE) = CAST(GETDATE() AS DATE)
          AND NAME IN (
              'SP-ECO-TBRA-4A-SEDE-CMC-3300-2',
              'SP-ECO-TBRA-15A-SEDE-SHAFT-3300',
              'SP-ECO-TBRA-4A-SEDE-CMC-3300-1',
              'SP-ECO-TBRA-3A-ANEXO-CPD-LNL2220',
              'SP-ECO-TBRA-TERREO-SEDE-CAT-2210'
          )
    `);

    res.json(result.recordset);
} catch (err) {
    console.error('Erro ao consultar os dados:', err);
    res.status(500).send('Erro ao consultar os dados');
}
});

app.get('/dados-chucri', async (req, res) => {
  const apiKey = req.query.key;

  // Validação da chave da API
  if (!apiKey || apiKey !== 'minha-chave') {
    return res.status(401).json({ erro: 'Acesso não autorizado. Chave inválida.' });
  }

  try {
    const result = await sql.query(`
        SELECT [DT_EVENT],
		[EVENT_TIME],
		[EMPID],
		[LASTNAME],
		[FIRSTNAME],
		[MIDNAME],
		[SSNO],
		[NAME],
		[CARDNUM],
		[DEVID],
		[EVTDESCR],
		[EVDESCR],
		[MACHINE],
		[READERDESC],
		[IM_DT_UPDATE]
FROM [AccessControl].[dbo].[VW_VIVO_CONSULTA_RH]
WHERE LASTNAME IS NOT NULL
	AND CAST(DT_EVENT AS DATE) = CAST(GETDATE() AS DATE)
	AND NAME IN (
		'SP - CHUCRI-TE-LNL3300',
		'SP - CHUCRI-1A-LNL3300-1',
		'SP - CHUCRI-1A-LNL3300-2'
	)
	AND READERDESC IN (
		'SP-CHUCRI-1AN-CATRACA CARACOL-E',
		'SP-CHUCRI-1AN-CATRACA CARACOL-S',
		'SP-CHUCRI-TE-CATRACA AMBULATORIO-S',
		'SP-CHUCRI-TE-CATRACA AMBULATORIO-E',
		'SP-CHUCRI-TE-CATRACA DEF AMBULATORIO-E',
		'SP-CHUCRI-TE-CATRACA DEF AMBULATORIO-S',
		'SP-CHUCRI-TE-CATRACA DESEG-E',
		'SP-CHUCRI-TE-CATRACA DESEG-S',
		'SP-CHUCRI-TE-CATRACA DEF DESEG-E',
		'SP-CHUCRI-TE-CATRACA DEF DESEG-S',
		'SP-CHUCRI-TB-CATRACA 01-E',
		'SP-CHUCRI-TB-CATRACA 01-S',
		'SP-CHUCRI-TB-CATRACA 02-E',
		'SP-CHUCRI-TB-CATRACA 02-S',
		'SP-CHUCRI-TB-CATRACA 03-E',
		'SP-CHUCRI-TB-CATRACA 03-S',
		'SP-CHUCRI-TA-CATRACA 04-E',
		'SP-CHUCRI-TA-CATRACA 04-S'
	)
    `);

    res.json(result.recordset);
} catch (err) {
    console.error('Erro ao consultar os dados:', err);
    res.status(500).send('Erro ao consultar os dados');
}
});

app.listen(port, () => {
console.log(`Servidor rodando em http://localhost:${port}`);
});