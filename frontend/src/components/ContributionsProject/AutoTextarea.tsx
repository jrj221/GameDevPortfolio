import { useEffect, useRef } from "react";

/** A textarea that grows a line at a time as its content wraps. */
const AutoTextarea = ({ value, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { value: string }) => {
	const ref = useRef<HTMLTextAreaElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${el.scrollHeight}px`;
	}, [value]);
	return <textarea ref={ref} rows={1} value={value} {...rest} />;
};

export default AutoTextarea;
