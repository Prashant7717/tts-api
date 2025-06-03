const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/tts', async (req, res) => {
  const text = req.body.text;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await axios.post(
      'https://dsc-team-tts.hf.space/run/predict',
      { data: [text] },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const audio_path = response.data.data?.[0];
    if (audio_path && audio_path.startsWith("http")) {
      res.json({ audio: audio_path });
    } else {
      res.status(500).json({ error: 'Audio link not found in response' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Failed to generate audio', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});