import { createMarkdownParser } from '@nuxtjs/mdc/runtime'

export default function useMarkdownParser() {
  let parser: Awaited<ReturnType<typeof createMarkdownParser>>

  return async (markdown: string) => {
    if (!parser) {
      parser = await createMarkdownParser()
    }

    return parser(markdown)
  }
}
