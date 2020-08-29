import React, { useState } from "react";
import { Modal } from "./index";
import {
	withKnobs, text, boolean, number,
} from "@storybook/addon-knobs";
import {action} from "@storybook/addon-actions"
import { Button } from "./../button"

export default {
	title: "Modal",
	component: Modal,
	decorators: [withKnobs],
};

function KnobsModal() {
	const [state, setState] = useState(false);
	const title = text("title", "标题");
	const child = text("children", "sdsdsssda");
	const confirm = boolean("confirm", true);
	const okText = text("okText", "");
	const cancelText = text("cancelText", "");

	// const body= document.getElementsByTagName('body')
	const body = document.body
	return (
		<div>
			<Modal
				container = {body}
				refCallback={action("refcallback")}
				stopScroll={boolean("stopScroll", true)}
				delay={number("delay", 200)}
				closeButton={boolean("closeButton", true)}
				mask={boolean("mask", true)}
				maskClose={boolean("maskClose", true)}
				callback={action("callback")}
				cancelText={cancelText}
				okText={okText}
				confirm={confirm}
				title={title}
				parentSetState={setState}
				visible={state}
			>
				{child}
			</Modal>
			<Button onClick={() => setState(!state)}>toggle</Button>
		</div>
	);
}

export const knobsModal = () => <KnobsModal></KnobsModal>;