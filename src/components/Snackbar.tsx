import Panel from "./Panel";

export interface Props {
  message?: string;
}

export default function Snackbar(props: Props) {
  return (
    <div className={props.message !== "" ? `snackbar show` : `snackbar`}>
      <Panel type="danger">{props.message}</Panel>
    </div>
  );
}
