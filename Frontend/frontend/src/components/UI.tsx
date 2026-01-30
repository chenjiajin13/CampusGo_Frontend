export const Spinner = () => <div style={{opacity:.7}}>Loading...</div>;
export const ErrorText = ({msg}:{msg:string}) => <div style={{color:'#f55'}}>{msg}</div>;
export const Button = (p: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
  <button {...p} className="px-3 py-2 rounded bg-indigo-700 text-white disabled:opacity-50" />;