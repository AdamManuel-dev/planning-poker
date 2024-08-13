import { Remark } from 'react-remark';
import useMarkdownFiles from '../../../markdowns/useMarkdowns';
import { useEffect } from 'react';

const ExampleMarkdown = ({ index }: { index: number; markdownFiles: string[] }) => {
  const { markdownFiles, loading } = useMarkdownFiles();

  useEffect(() => {
    if (markdownFiles[index]) console.log(markdownFiles[index]);
  }, [index, loading]);

  return <Remark>{markdownFiles[index]}</Remark>;
};

export default ExampleMarkdown;
