import OpenAI from "openai"

const { Configuration, OpenAIApi } = require("openai")

const { OPENAI_API_KEY } = process.env

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

