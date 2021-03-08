import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DropdownButton } from "../ui/buttons/DropdownButton";
import { EditableText } from "../ui/form/EditableText";
import {
  FormContainer,
  FormDivider,
  FormHeader,
  FormRow,
} from "../ui/form/FormLayout";
import { Sidebar, SidebarColumn } from "../ui/sidebars/Sidebar";
import { Label } from "../ui/form/Label";
import { RootState } from "../../store/configureStore";
import { Input } from "../ui/form/Input";
import { InstrumentDutyEditor } from "./InstrumentDutyEditor";
import { InstrumentWaveEditor } from "./InstrumentWaveEditor";
import { InstrumentNoiseEditor } from "./InstrumentNoiseEditor";
import { Song } from "../../lib/helpers/uge/song/Song";
import castEventValue from "../../lib/helpers/castEventValue";
import l10n from "../../lib/helpers/l10n";
import { DutyInstrument, NoiseInstrument, WaveInstrument } from "../../store/features/tracker/trackerTypes";
import trackerActions from "../../store/features/tracker/trackerActions";

interface SongEditorProps {
  id: string;
}

const renderInstrumentEditor = (type: string, instrumentData: DutyInstrument | NoiseInstrument | WaveInstrument | null) => {
  if (type === "instrument") return <InstrumentDutyEditor id={`instrument_${instrumentData?.index}`} instrument={instrumentData as DutyInstrument} />

  if (type === "noise") return <InstrumentNoiseEditor id={`instrument_${instrumentData?.index}`} instrument={instrumentData as NoiseInstrument} />

  if (type === "wave") return <InstrumentWaveEditor id={`instrument_${instrumentData?.index}`} instrument={instrumentData as WaveInstrument} />
}

export const SongEditor = ({
  id
}: SongEditorProps) => {
  const dispatch = useDispatch();
  const selectedInstrument = useSelector(
    (state: RootState) => state.editor.selectedInstrument
  );

  const song = useSelector((state: RootState) => 
    state.tracker.song
  );
  console.log("SONG", song)

  const selectSidebar = () => { };

  const onChangeFieldInput = <T extends keyof Song>(key: T) => (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
      const editValue = castEventValue(e);
    dispatch(
      trackerActions.editSong({
        changes: {
          [key]: editValue,
        },
      })
    );
  };

  let instrumentData: DutyInstrument | NoiseInstrument | WaveInstrument | null = null;
  if (song) {
    const selectedInstrumentId = parseInt(selectedInstrument.id);
    switch (selectedInstrument.type) {
      case "instrument":
        instrumentData = song.duty_instruments[selectedInstrumentId];
        break;
      case "noise":
        instrumentData = song.noise_instruments[selectedInstrumentId];
        break;
      case "wave":
        instrumentData = song.wave_instruments[selectedInstrumentId];
        break;
    }
  }
  console.log(instrumentData);

  if (!song || !instrumentData) {
    return null;
  }

  return (
    <Sidebar onClick={selectSidebar}>
      <SidebarColumn>
        <FormContainer>
          <FormHeader>
            <EditableText
              name="name"
              placeholder="Song"
              value={song?.name || ""}
              onChange={onChangeFieldInput("name")}
            />

            <DropdownButton
              size="small"
              variant="transparent"
              menuDirection="right"
            >
              {/* <MenuItem onClick={onCopyVar}>
                {l10n("MENU_VARIABLE_COPY_EMBED")}
              </MenuItem>
              <MenuItem onClick={onCopyChar}>
                {l10n("MENU_VARIABLE_COPY_EMBED_CHAR")}
              </MenuItem> */}
            </DropdownButton>
          </FormHeader>

          <FormRow>
            <Label htmlFor="artist">{l10n("FIELD_ARTIST")}</Label>
          </FormRow>
          <FormRow>
            <Input
              name="artist"
              value={song?.artist}
              onChange={onChangeFieldInput("artist")}
            />
          </FormRow>
          <FormRow>
            <Label htmlFor="ticks_per_row">{l10n("FIELD_TEMPO")}</Label>
          </FormRow>
          <FormRow>
            <Input
              name="ticks_per_row"
              type="number"
              value={song?.ticks_per_row}
              min={0}
              max={20}
            />
          </FormRow>
          <FormDivider />
          <FormHeader>
            <EditableText
              name="instrumentName"
              placeholder="Instrument"
              value={instrumentData ? instrumentData.name : ""}
              onChange={onChangeFieldInput("name")}
            />

            <DropdownButton
              size="small"
              variant="transparent"
              menuDirection="right"
            >
              {/* <MenuItem onClick={onCopyVar}>
                {l10n("MENU_VARIABLE_COPY_EMBED")}
              </MenuItem>
              <MenuItem onClick={onCopyChar}>
                {l10n("MENU_VARIABLE_COPY_EMBED_CHAR")}
              </MenuItem> */}
            </DropdownButton>
          </FormHeader>
          {
            renderInstrumentEditor(selectedInstrument.type, instrumentData)
          }
        </FormContainer>
      </SidebarColumn>
    </Sidebar>
  );
};
