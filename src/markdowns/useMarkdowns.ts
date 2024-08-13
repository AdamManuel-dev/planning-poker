import { useState, useEffect } from 'react';

const useMarkdownFiles = () => {
  const [markdownFiles, setMarkdownFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdownFiles = async () => {
      try {
        const response = await fetch('/markdownFiles.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setMarkdownFiles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdownFiles();
  }, []);

  return { markdownFiles, loading, error };
};

export default useMarkdownFiles;
