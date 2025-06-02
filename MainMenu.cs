using Godot;
using System;

public partial class MainMenu : Control
{
	
	private Button _startButton;

	public override void _Ready()
	{
		
		//_startButton = GetNode<Button>("Button");
		
		//_startButton.Connect("pressed", this, nameof(OnStartButtonPressed));
	}

	private void OnStartButtonPressed()
	{
		GD.Print("Кнопка 'Пуск' нажата!");
		//GetTree().ChangeScene("res://GameScene.tscn");
	}
	
}
