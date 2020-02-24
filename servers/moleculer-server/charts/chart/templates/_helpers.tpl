# fqdn
{{- define "region"}}cluster{{- end}}
{{- define "tld"}}local{{- end}}

{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "fullname" -}}
{{- $name := default "" -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- /*
https://github.com/technospophos/common-chart/
chartref prints a chart name and version.
It does minimal escaping for use in Kubernetes labels.
Example output:
  zookeeper-1.2.3
  wordpress-3.2.1_20170219
*/ -}}
{{- define "chartref" }}
  {{- replace "+" "_" .Chart.Version | printf "%s-%s" .Chart.Name -}}
{{- end -}}


{{- /*
https://github.com/technosophos/common-chart/
labels.standard prints the standard Helm labels.
The standard labels are frequently used in metadata.
*/ -}}
{{- define "labels.standard" -}}
app: {{ template "fullname" . }}
heritage: {{ .Release.Service | quote }}
release: {{ .Release.Name | quote }}
chart: {{ template "chartref" . }}
{{- end -}}


{{/*
Create a default fully qualified zipkin name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "zipkin.fullname" -}}
{{- printf "%s-%s-%s" .Release.Namespace .Values.external.name "zipkin" | trunc 63 | trimSuffix "-" -}}
{{- end -}}


{{/*
Create a default fully qualified nats name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "nats.fullname" -}}
{{- printf "%s-%s-%s" .Release.Namespace .Values.external.name "nats" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified mysql name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "mongodb.fullname" -}}
{{- printf "%s-%s-%s" .Release.Namespace .Values.external.name "mongodb" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified zipkin name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "redis.fullname" -}}
{{- printf "%s-%s-%s" .Release.Namespace .Values.external.name "redis" | trunc 63 | trimSuffix "-" -}}
{{- end -}}


{{- define "nats_host"}}{{ include "nats.fullname" . }}.{{.Release.Namespace}}.svc.{{ include "region" . }}.{{ include "tld" . }}{{- end}}
{{- define "mongodb_host"}}{{ include "mongodb.fullname" . }}.{{.Release.Namespace}}.svc.{{ include "region" . }}.{{ include "tld" . }}{{- end}}
{{- define "mongodb_service"}}mongodb://{{ include "mongodb_host" . }}:{{ .Values.external.service.mongodb.port }}/{{ .Values.external.service.mongodb.dbname }}{{- end}}
{{- define "nats_service"}}nats://{{ include "nats_host" . }}:{{ .Values.external.service.nats.port }}{{- end}}
{{- define "zipkin_host"}}{{ include "zipkin.fullname" . }}.{{.Release.Namespace}}.svc.{{ include "region" . }}.{{ include "tld" . }}{{- end}}
{{- define "redis_host"}}{{ include "redis.fullname" . }}.{{.Release.Namespace}}.svc.{{ include "region" . }}.{{ include "tld" . }}{{- end}}
{{- define "redis_service"}}redis://{{ include "redis_host" . }}:{{ .Values.external.service.redis.port }}{{- end}}
