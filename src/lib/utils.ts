export function parseOutreachCopy(outreachCopy: string) {
    const email = outreachCopy.match(/Cold Email:[\s\S]*?(?=LinkedIn Hooks:|$)/)?.[0] || '';
    const hooks = outreachCopy.match(/LinkedIn Hooks:[\s\S]*?(?=Suggested CTAs:|$)/)?.[0] || '';
    const ctas = outreachCopy.match(/Suggested CTAs:[\s\S]*$/)?.[0] || '';
  
    return { email, hooks, ctas };
  }

  
export function parsePitchAdvanced(pitch: string) {
    const regex = /([1-9] [\s\S]*?)(?=\n[1-9] |$)/g;
    const matches = pitch.match(regex) || [];
    return matches.map((block) => {
      const [heading, ...rest] = block.split('\n');
      return {
        title: heading.trim(),
        content: rest.join('\n').trim(),
      };
    });
  }
  