import { useTranslation } from "react-i18next";
export default function Test() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("search_placeholder")}</h1>
    </div>
  );
}
