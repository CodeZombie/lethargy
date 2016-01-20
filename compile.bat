::this script takes all the .js files in js/, and concatenates them into a single javascript file
@echo off
(for /f "delims=" %%a in ('dir /b /a-d js\*.js') do (
	echo(
	echo(/*######### %%a #########*/
	echo(
	type js\"%%~a"
	echo(
))>engine.js