import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import debounce from "lodash.debounce";

import { getProject } from "../../redux/reducers/projectReducer";
import { Project } from "../../types/project";

const DEBOUNCE_SAVE_DELAY_MS = 2000;
const INTERVAL_SAVE_DELAY_MS = 20000;

interface AutosaveProps {
  isProjectHydrated: boolean;
  data: Project;
  onProjectCreate: (newData: Project) => void;
  onProjectUpdate: (newData: Project) => void;
}

export default function Autosave({ isProjectHydrated, data, onProjectCreate, onProjectUpdate }: AutosaveProps) {
  const project = useSelector(getProject);

  const saveData = useCallback((newData: Project, projectId?: number) => {
    if (projectId) onProjectUpdate(newData);
    else onProjectCreate(newData);
  }, []);

  const debouncedSave = useCallback(
    debounce(async (newData: Project, projectId?: number) => {
      saveData(newData, projectId);
    }, DEBOUNCE_SAVE_DELAY_MS),
    [],
  );

  useEffect(() => {
    if (data && isProjectHydrated) {
      debouncedSave(data, project?.projectId);
    }
  }, [data.paragraphs, isProjectHydrated, debouncedSave, project?.projectId]);

  useEffect(() => {
    // if (project?.projectId && isProjectHydrated && data) {
    //   setInterval(() => {
    //     console.log("!!!! INTERVAL TRIGGERED");
    //     saveData(data, project?.projectId);
    //   }, INTERVAL_SAVE_DELAY_MS);
    // }
  }, [project?.projectId, isProjectHydrated]);

  return null;
}
