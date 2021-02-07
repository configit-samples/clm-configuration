import React, { useState } from 'react';
import { ConfigurationVariable, Phase } from '../../../api/types/configurator';
import { useConfigurator } from '../ConfiguratorContext';
import { Button } from '../../../components/Button';
import { ReactComponent as PenIcon } from 'heroicons/outline/pencil.svg';
import * as utils from '../../../api/utils';
import { Popover } from '../../../components/Popover';

type PhasePreviewProps = {
  phase: Phase;
  onEdit: () => void;
};
export function PhasePreview({ phase, onEdit }: PhasePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { configuration } = useConfigurator();
  const name = utils.getPhaseName(phase);
  const phaseVariables = utils.getPhaseVariables(phase, configuration);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-blue-900 focus:outline-none cursor-pointer border-b border-gray-900 rounded-none flex items-center"
      >
        <PenIcon width="0.75em" height="0.75em" /> {name}
      </button>
      <Popover isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-gray-700">{name} Assignments</div>
        <table className="table mt-3">
          <tbody>
            {phaseVariables.map((v: ConfigurationVariable) => {
              const val = utils.getAssignedValue(v);
              return (
                <tr key={v.id + `_` + val?.value} className="bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-1">
                    <strong>{v.name}</strong>
                  </td>
                  <td className="whitespace-nowrap px-2">{val?.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-6 flex self-end">
          <Button
            size="small"
            variant="primary"
            className="mr-2"
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
          >
            <PenIcon width="0.75em" height="0.75em" /> Edit
          </Button>
          <Button size="small" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </Popover>
    </div>
  );
}
