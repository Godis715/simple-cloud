import React from "react";
import "./Terminal.scss";

type Props = {
    stdout: string
};

export default function Terminal(props: Props): JSX.Element {
    const { stdout } = props;

    return (
        <div className="Terminal">
            <div className="Terminal-Content">
                {stdout.split("").map((ch, i) => (
                    <React.Fragment key={i}>
                        {ch}<wbr />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
